const https = require('https');

https.get('https://github.com/kskreddy2k7', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const pinnedRegex = /<span class="repo"[^>]*title="([^"]+)"/g;
    const matches = [...data.matchAll(pinnedRegex)];
    console.log("Pinned:", matches.map(m => m[1]));
    
    if (matches.length === 0) {
      const itemRegex = /pinned-item-list-item-content[^>]*>[\s\S]*?<a[^>]*href="\/kskreddy2k7\/([^"]+)"/g;
      const m2 = [...data.matchAll(itemRegex)];
      console.log("Fallback Pinned:", m2.map(m => m[1]));
    }
  });
});
