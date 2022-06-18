// oss-licenses.json to LICENSE file (human friendly)

const fs = require('fs');
const path = require('path');

const licenses = JSON.parse(fs.readFileSync(path.join(__dirname, '../dist/oss-licenses.json'), 'utf-8'));

let text = '';

for (const license of licenses) {
  text += `${license.name}
author: ${license.author}
license: ${license.license}
${license.licenseText ?? ''}

-------------------
`;
}

fs.writeFileSync(path.join(__dirname, '../dist/LICENSE'), text);
