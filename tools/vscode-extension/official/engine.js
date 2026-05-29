// official/engine.js는 core/engine.js로 위임합니다.
const fs = require('fs');
const path = require('path');

const candidates = [
  #!/usr/bin/env node
  const fs = require('fs');
  const path = require('path');

  // 간단한 래퍼: 우선 '../../core/engine.js'를 시도하고 실패하면 '../../../core/engine.js'를 시도합니다.
  const candidates = [
    path.join(__dirname, '..', '..', 'core', 'engine.js'),
    path.join(__dirname, '..', '..', '..', 'core', 'engine.js'),
    path.join(__dirname, '..', '..', '..', '..', 'core', 'engine.js')
  ];

  let found = null;
  for (const c of candidates) {
    try { if (fs.existsSync(c)) { found = c; break; } } catch (e) {}
  }

  if (!found) {
    console.error('오류: core/engine.js 를 찾을 수 없습니다. 시도한 경로: ' + candidates.join(', '));
    throw new Error('core/engine.js not found');
  }

  module.exports = require(found);
  JeomVM.prototype._setVar=function(n,v){this.env[n]=v;};
  JeomVM.prototype._getVar=function(n){
    if(Object.prototype.hasOwnProperty.call(this.env,n)) return this.env[n];
    throw new JeomError('정의되지 않은 변수: \''+n+'\'');
  };
  JeomVM.prototype._regFunc=function(node){
    var fn={args:node.args,body:node.body,closure:Object.assign({},this.env),_isFunc:true};
    this.functions[node.name]=fn; this.env[node.name]=fn;
  };

  JeomVM.prototype._execList=async function(stmts){
    var i=0;
    while(i<stmts.length){
      this.stepCount++;
      if(this.stepCount>this.maxSteps) throw new JeomError('최대 스텝 초과 — 무한루프?');
      try{ await this._exec(stmts[i]); }
      catch(e){
        if(e&&e.name==='JeomGoto'){
          var found=false;
          for(var j=0;j<stmts.length;j++){
            if(stmts[j].type==='LABEL'&&stmts[j].name===e.label){i=j+1;found=true;break;}
          }
          if(!found) throw e;
          continue;
        }
        throw e;
      }
      i++;
    }
  };

  JeomVM.prototype._exec=async function(node){
    if(!node) return;
    if(Array.isArray(node)){await this._execList(node);return;}
    switch(node.type){
      case 'PUSH':    this._push(await this._eval(node.expr)); break;
      case 'VARSET':  this._setVar(node.name,await this._eval(node.expr)); break;
      case 'STORE':   this._setVar(node.name,this._pop()); break;
      case 'GETVAR':  this._push(this._getVar(node.name)); break;
      case 'DELVAR':  delete this.env[node.name]; break;
      case 'FUNCDEF': this._regFunc(node); break;
      case 'LAMBDA':{
        var cl=Object.assign({},this.env);
        this._push({args:node.args,body:node.body,closure:cl,_isFunc:true});
        break;
      }
      case 'CALL':   await this._callByName(node.name); break;
      case 'IF':     await this._execIf(node); break;
      case 'LOOP':   await this._execLoop(node); break;
      case 'WHILE':  await this._execWhile(node); break;
      case 'TRY':    await this._execTry(node); break;
      case 'THROW':  throw new JeomError(String(this._pop()));
      case 'LABEL':  break;
      case 'GOTO':   throw new JeomGoto(node.name);
      case 'BLOCK':  await this._execList(node.body); break;
      case 'MAIN':   await this._execList(node.body); break;
      case 'IMPORT': await this._doImport(); break;
      case 'EXPORT': break;
      case 'INSTR':  await this._execInstr(node.op); break;
      default: throw new JeomError('알 수 없는 노드: \''+node.type+'\'');
    }
  };

  JeomVM.prototype._eval=async function(node){
    switch(node.type){
      case 'NUM_LIT': return node.value;
      case 'STR_LIT': return node.value;
      case 'GETVAR':  return this._getVar(node.name);
      case 'NAME':    return this._getVar(node.raw);
      default: await this._exec(node); return this._pop();
    }
  };

  JeomVM.prototype._execIf=async function(node){
    var cond=this._pop();
    if(this._truthy(cond)){await this._execList(node.thenBody);return;}
    for(var i=0;i<node.elifBranches.length;i++){
      await this._execList(node.elifBranches[i].cond);
      if(this._truthy(this._pop())){await this._execList(node.elifBranches[i].body);return;}
    }
    if(node.elseBody) await this._execList(node.elseBody);
  };

  JeomVM.prototype._execLoop=async function(node){
    var count=Math.max(0,Math.floor(this._num(this._pop())));
    for(var i=0;i<count;i++){
      try{await this._execList(node.body);}
      catch(e){
        if(e&&e.name==='JeomBreak') break;
        if(e&&e.name==='JeomContinue') continue;
        throw e;
      }
    }
  };

  JeomVM.prototype._execWhile=async function(node){
    var guard=0;
    while(true){
      if(++guard>this.maxLoop) throw new JeomError('WHILE 최대반복 초과');
      await this._execList(node.condBody);
      if(!this._truthy(this._pop())) break;
      try{await this._execList(node.body);}
      catch(e){
        if(e&&e.name==='JeomBreak') break;
        if(e&&e.name==='JeomContinue') continue;
        throw e;
      }
    }
  };

  JeomVM.prototype._execTry=async function(node){
    try{await this._execList(node.tryBody);}
    catch(e){
      if(e&&(e.name==='JeomBreak'||e.name==='JeomContinue'||e.name==='JeomReturn'||e.name==='JeomExit')) throw e;
      if(node.catchBody){this._push(e.message||String(e));await this._execList(node.catchBody);}
      else throw e;
    } finally {
      if(node.finallyBody) await this._execList(node.finallyBody);
    }
  };

  JeomVM.prototype._callByName=async function(name){
    var fn=this.functions[name]||(Object.prototype.hasOwnProperty.call(this.env,name)?this.env[name]:null);
    if(!fn||!fn.args) throw new JeomError('정의되지 않은 함수: \''+name+'\'');
    await this._callFn(fn);
  };

  JeomVM.prototype._callFn=async function(fn){
    if(!fn||!fn.args) throw new JeomError('함수 객체 아님');
    this.callDepth++;
    if(this.callDepth>this.maxCallDepth) throw new JeomError('최대 재귀깊이 초과');
    var args=[];
    for(var i=0;i<fn.args.length;i++) args.unshift(this._pop());
    var saved=Object.assign({},this.env);
    this.env=Object.assign({},fn.closure);
    for(var j=0;j<fn.args.length;j++) this.env[fn.args[j]]=args[j];
    try{await this._execList(fn.body);}
    catch(e){
      if(e&&e.name==='JeomReturn'){if(e.value!==undefined)this._push(e.value);}
      else throw e;
    } finally {
      this.env=saved; this.callDepth--;
    }
  };

  JeomVM.prototype._doImport=async function(){
    var path=String(this._pop());
    if(this.modules[path]){
      Object.assign(this.env,this.modules[path]);
      Object.assign(this.functions,this.modules[path+':fn']||{});
      return;
    }
    var src;
    try{src=await this.readFile(path);}
    catch(e){throw new JeomError('모듈 로드 실패: \''+path+'\' — '+e.message);}
    var sub=new JeomVM({stdout:this.stdout,stderr:this.stderr,stdin:this.stdin,
      readFile:this.readFile,writeFile:this.writeFile,fileExists:this.fileExists,getEnv:this.getEnv});
    var stmts=parse(tokenize(src));
    for(var i=0;i<stmts.length;i++) if(stmts[i].type==='FUNCDEF') sub._regFunc(stmts[i]);
    var main=null;
    for(var j=0;j<stmts.length;j++) if(stmts[j].type==='MAIN'){main=stmts[j];break;}
    if(main) await sub._execList(main.body);
    this.modules[path]=sub.env;
    this.modules[path+':fn']=sub.functions;
    Object.assign(this.env,sub.env);
    Object.assign(this.functions,sub.functions);
  };

  JeomVM.prototype._execInstr=async function(op){
    var a,b,v,n,fn,arr,d,k,i,res,parts,fh,r;
    switch(op){
      case 'POP_CMD': this._pop(); break;
      case 'PEEK':    this._push(this._peek()); break;
      case 'SWAP':    b=this._pop();a=this._pop();this._push(b);this._push(a); break;
      case 'DUP':     this._push(this._peek()); break;
      case 'ADD': b=this._pop();a=this._pop();this._push(this._add(a,b)); break;
      case 'SUB': b=this._pop();a=this._pop();this._push(this._num(a)-this._num(b)); break;
      case 'MUL': b=this._pop();a=this._pop();this._push(this._num(a)*this._num(b)); break;
      case 'DIV': {
        b=this._pop();a=this._pop();
        if(this._num(b)===0) throw new JeomError('0으로 나눌 수 없음');
        this._push(this._num(a)/this._num(b)); break;
      }
      case 'MOD': b=this._pop();a=this._pop();this._push(this._num(a)%this._num(b)); break;
      case 'POW': b=this._pop();a=this._pop();this._push(Math.pow(this._num(a),this._num(b))); break;
      case 'AND': b=this._pop();a=this._pop();this._push(this._truthy(a)&&this._truthy(b)?1:0); break;
      case 'OR':  b=this._pop();a=this._pop();this._push(this._truthy(a)||this._truthy(b)?1:0); break;
      case 'NOT': this._push(this._truthy(this._pop())?0:1); break;
      case 'XOR': b=this._pop();a=this._pop();this._push(!!this._truthy(a)!==!!this._truthy(b)?1:0); break;
      case 'EQ':  b=this._pop();a=this._pop();this._push(a==b?1:0); break;
      case 'NEQ': b=this._pop();a=this._pop();this._push(a!=b?1:0); break;
      case 'LT':  b=this._pop();a=this._pop();this._push(a<b?1:0); break;
      case 'GT':  b=this._pop();a=this._pop();this._push(a>b?1:0); break;
      case 'LTE': b=this._pop();a=this._pop();this._push(a<=b?1:0); break;
      case 'GTE': b=this._pop();a=this._pop();this._push(a>=b?1:0); break;
      case 'PRINT':   this.stdout(String(this._disp(this._pop()))); break;
      case 'PRINTLN': this.stdout(String(this._disp(this._pop()))+'\n'); break;
      case 'ERR':     this.stderr(String(this._disp(this._pop()))+'\n'); break;
      case 'FMT':{
        n=Math.floor(this._num(this._pop()));
        var fmt=String(this._pop()), fa=[];
        for(i=0;i<n;i++) fa.unshift(this._pop());
        this.stdout(fmt.replace(/%[sdf]/g,function(){return String(fa.shift()!=null?fa.shift():'');}));
        break;
      }
      case 'INPUT':  this._push(await this.stdin()); break;
      case 'INPUTN': {var sv=await this.stdin();this._push(isNaN(sv)?0:Number(sv));break;}
      case 'INT': {
        v=this._pop();var ni=Math.trunc(Number(v));
        if(isNaN(ni)) throw new JeomError('INT 변환 실패: '+v);
        this._push(ni); break;
      }
      case 'FLOAT': {v=this._pop();var nf=Number(v);if(isNaN(nf))throw new JeomError('FLOAT 변환 실패: '+v);this._push(nf);break;}
      case 'STR':  this._push(String(this._disp(this._pop()))); break;
      case 'BOOL': this._push(this._truthy(this._pop())?1:0); break;
      case 'TYPE': {v=this._pop();this._push(Array.isArray(v)?'array':typeof v);break;}
      case 'CAST': {
        var tgt=String(this._pop());v=this._pop();
        if(tgt==='int')this._push(Math.trunc(Number(v)));
        else if(tgt==='float')this._push(Number(v));
        else if(tgt==='str')this._push(String(v));
        else throw new JeomError('CAST: 알 수 없는 타입 \''+tgt+'\'');
        break;
      }
      case 'LEN': {
        v=this._pop();
        if(v==null) throw new JeomError('LEN: null');
        this._push(v.length!==undefined?v.length:Object.keys(v).length); break;
      }
      case 'ARR': {
        n=Math.max(0,Math.floor(this._num(this._pop())));
        var items=[];for(i=0;i<n;i++)items.unshift(this._pop());
        this._push(items); break;
      }
      case 'IDX': {
        var idx=this._pop();arr=this._pop();
        if(Array.isArray(arr)){
          var ii=Number(idx);
          if(ii<0||ii>=arr.length) throw new JeomError('IDX: 범위초과('+ii+', len='+arr.length+')');
          this._push(arr[ii]);
        } else if(arr&&typeof arr==='object'){
          this._push(arr[idx]!==undefined?arr[idx]:null);
        } else throw new JeomError('IDX: 배열/딕셔너리 아님');
        break;
      }
      case 'IDXS': {
        v=this._pop();var idx2=this._pop();arr=this._pop();
        if(!arr||typeof arr!=='object') throw new JeomError('IDXS: 배열/딕셔너리 아님');
        arr[Array.isArray(arr)?Number(idx2):idx2]=v; this._push(arr); break;
      }
      case 'APP': {
        v=this._pop();arr=this._pop();
        if(!Array.isArray(arr)) throw new JeomError('APP: 배열 아님');
        arr.push(v);this._push(arr); break;
      }
      case 'SLICE': {
        var se=this._pop(),ss=this._pop(),sa=this._pop();
        if(sa==null) throw new JeomError('SLICE: null');
        this._push(sa.slice(Number(ss),Number(se))); break;
      }
      case 'KEYS': {d=this._pop();if(!d||typeof d!=='object'||Array.isArray(d))throw new JeomError('KEYS: 딕셔너리 아님');this._push(Object.keys(d));break;}
      case 'VALS': {d=this._pop();if(!d||typeof d!=='object'||Array.isArray(d))throw new JeomError('VALS: 딕셔너리 아님');this._push(Object.values(d));break;}
      case 'MAP': {
        fn=this._pop();arr=this._pop();
        if(!Array.isArray(arr)) throw new JeomError('MAP: 배열 아님');
        res=[];
        for(i=0;i<arr.length;i++){this._push(arr[i]);await this._callFn(fn);res.push(this.stack.length?this._pop():null);}
        this._push(res); break;
      }
      case 'FILTER': {
        fn=this._pop();arr=this._pop();
        if(!Array.isArray(arr)) throw new JeomError('FILTER: 배열 아님');
        res=[];
        for(i=0;i<arr.length;i++){this._push(arr[i]);await this._callFn(fn);if(this._truthy(this._pop()))res.push(arr[i]);}
        this._push(res); break;
      }
      case 'REDUCE': {
        var init=this._pop();fn=this._pop();arr=this._pop();
        if(!Array.isArray(arr)) throw new JeomError('REDUCE: 배열 아님');
        var acc=init;
        for(i=0;i<arr.length;i++){this._push(acc);this._push(arr[i]);await this._callFn(fn);acc=this._pop();}
        this._push(acc); break;
      }
      case 'DICT': {
        n=Math.max(0,Math.floor(this._num(this._pop())));
        parts=[];for(i=0;i<n*2;i++)parts.unshift(this._pop());
        d={};for(i=0;i<parts.length;i+=2)d[parts[i]]=parts[i+1];
        this._push(d); break;
      }
      case 'DGET': {k=this._pop();d=this._pop();if(!d||typeof d!=='object')throw new JeomError('DGET: 딕셔너리 아님');this._push(d[k]!==undefined?d[k]:null);break;}
      case 'DSET': {v=this._pop();k=this._pop();d=this._pop();if(!d||typeof d!=='object')throw new JeomError('DSET: 딕셔너리 아님');d[k]=v;this._push(d);break;}
      case 'BREAK':  throw new JeomBreak();
      case 'CONT':   throw new JeomContinue();
      case 'RET':    throw new JeomReturn(this.stack.length?this._pop():undefined);
      case 'ASSERT': {if(!this._truthy(this._pop()))throw new JeomError('ASSERT 실패');break;}
      case 'NOOP':   break;
      case 'ARGC': {var fn2n=String(this._pop());fn=this.functions[fn2n]||this.env[fn2n];this._push(fn&&fn.args?fn.args.length:0);break;}
      case 'CURRY': {
        var part=this._pop();fn=this._pop();
        if(!fn||!fn.args||fn.args.length===0) throw new JeomError('CURRY: 함수 아님');
        var nc=Object.assign({},fn.closure);nc[fn.args[0]]=part;
        this._push({args:fn.args.slice(1),body:fn.body,closure:nc,_isFunc:true}); break;
      }
      case 'DEBUG':  this.stderr('[DEBUG] stack='+JSON.stringify(this.stack)+'\n'); break;
      case 'TIME':   this._push(Date.now()/1000); break;
      case 'RAND':   this._push(Math.random()); break;
      case 'HASH': {
        var hs=String(this._pop()),h=5381;
        for(i=0;i<hs.length;i++) h=((h<<5)+h+hs.charCodeAt(i))&0xffffffff;
        this._push((h>>>0).toString(16).padStart(8,'0')); break;
      }
      case 'REGEX': {
        var pat=String(this._pop()),txt=String(this._pop());
        try{var rm=txt.match(new RegExp(pat));this._push(rm?rm[0]:null);}
        catch(re){throw new JeomError('REGEX: '+re.message);}
        break;
      }
      case 'SLEEP': {
        var ms=Math.max(0,this._num(this._pop()));
        await new Promise(function(resolve){setTimeout(resolve,ms);}); break;
      }
      case 'EXIT':   {var ec=this.stack.length?this._pop():0;throw new JeomExit(Number(ec));}
      case 'ENV':    this._push(this.getEnv(String(this._pop()))); break;
      case 'EVAL': {
        var esrc=String(this._pop());
        var esub=new JeomVM({stdout:this.stdout,stderr:this.stderr,stdin:this.stdin,
          readFile:this.readFile,writeFile:this.writeFile,fileExists:this.fileExists,getEnv:this.getEnv});
        esub.functions=Object.assign({},this.functions);
        esub.env=Object.assign({},this.env);
        await esub.run(esrc);
        if(esub.stack.length) this._push(esub.stack[esub.stack.length-1]);
        break;
      }
      case 'EXEC': {var cmd=String(this._pop());this._push(await this.execCmd(cmd));break;}
      case 'FOPEN': {var fm=String(this._pop()),fp=String(this._pop());this._push({_jeomFile:true,path:fp,mode:fm});break;}
      case 'FREAD': {fh=this._pop();if(!fh||!fh._jeomFile)throw new JeomError('FREAD: 핸들 아님');this._push(await this.readFile(fh.path));break;}
      case 'FWRITE':{v=String(this._pop());fh=this._pop();if(!fh||!fh._jeomFile)throw new JeomError('FWRITE: 핸들 아님');await this.writeFile(fh.path,v);break;}
      case 'FCLOSE': this._pop(); break;
      case 'FEXIST': {this._push((await this.fileExists(String(this._pop())))?1:0);break;}
      case 'FDELETE':{await this.deleteFile(String(this._pop()));break;}
      case 'FLIST':  {this._push(await this.listDir(String(this._pop())));break;}
      case 'MKDIR':  {await this.makeDir(String(this._pop()));break;}
      default: throw new JeomError('알 수 없는 명령: \''+op+'\'');
    }
  };

  JeomVM.prototype._truthy=function(v){
    if(v===null||v===undefined) return false;
    if(typeof v==='number') return v!==0;
    if(typeof v==='string') return v.length>0;
    if(Array.isArray(v)) return v.length>0;
    if(typeof v==='object') return true;
    return Boolean(v);
  };
  JeomVM.prototype._num=function(v){
    var n=Number(v);
    if(isNaN(n)) throw new JeomError('숫자 변환 불가: '+JSON.stringify(v));
    return n;
  };
  JeomVM.prototype._add=function(a,b){
    if(typeof a==='string'||typeof b==='string') return this._disp(a)+this._disp(b);
    if(Array.isArray(a)&&Array.isArray(b)) return a.concat(b);
    return this._num(a)+this._num(b);
  };
  JeomVM.prototype._disp=function(v){
    var self=this;
    if(v===null||v===undefined) return 'null';
    if(typeof v==='boolean') return v?'true':'false';
    if(Array.isArray(v)) return '['+v.map(function(x){return self._disp(x);}).join(', ')+']';
    if(v&&v._jeomFile) return '<File:'+v.path+'>';
    if(typeof v==='object'&&!v._isFunc)
      return '{'+Object.entries(v).map(function(e){return e[0]+': '+self._disp(e[1]);}).join(', ')+'}';
    return String(v);
  };

  // ══════════════════════════════════════════════════════════════
  // §8  공개 API
  // ══════════════════════════════════════════════════════════════

  return {
    VERSION:VERSION,
    encodeString:encodeString, encodeNumber:encodeNumber, encodeFloat:encodeFloat,
    decodeString:decodeString, decodeNumber:decodeNumber,
    tokenize:tokenize, parse:parse,
    JeomVM:JeomVM,
    JeomError:JeomError, JeomBreak:JeomBreak, JeomContinue:JeomContinue,
    JeomReturn:JeomReturn, JeomGoto:JeomGoto, JeomExit:JeomExit,
    OP_TABLE:OP_TABLE, DOT_CHARS:DOT_CHARS, C:C,
  };
}));