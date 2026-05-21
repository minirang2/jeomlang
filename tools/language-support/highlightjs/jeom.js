hljs.registerLanguage('jeom', function (hljs) {
  return {
    name: 'Jeom',
    contains: [
      {
        className: 'comment',
        begin: '◘',
        end: '$'
      },
      {
        className: 'string',
        begin: '●',
        end: '●'
      },
      {
        className: 'number',
        begin: '•',
        end: '•'
      },
      {
        className: 'keyword',
        begin: '(⋮⋮|⋮|…|‥|˙|∘)'
      }
    ]
  };
});
