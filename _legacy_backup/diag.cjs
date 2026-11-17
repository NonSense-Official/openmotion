const fs = require('fs');
const xml = fs.readFileSync('storage/projects/i7oE822sn7F2nBAwploDBk/scene.xml', 'utf8');
const matches = xml.match(/<(shape|text|group|audio|nullobj|camera|drawing|embedScene)/g);
console.log('Layer tags count:', matches ? matches.length : 0);
const sAttr = [...xml.matchAll(/\bs="([^"]*)"/g)].map(m => m[1]);
const unique = [...new Set(sAttr)];
console.log('Unique shape types:', unique);
// Check parent attribute
const parents = xml.match(/parent="[^"]*"/g);
const uniqueParents = [...new Set(parents ? parents : [])];
console.log('Parent refs count:', uniqueParents.length);
