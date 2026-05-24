const fs = require('fs');
const path = require('path');

const files = [
  'design.md',
  'app/globals.css',
  'components/layout/SplitLayout.tsx',
  'components/ui/StepIndicator.tsx',
  'components/ui/Input.tsx',
  'components/ui/SectionHeader.tsx',
  'components/ui/SelectCard.tsx',
  'components/ui/Button.tsx'
];

files.forEach(f => {
  const filePath = path.join(__dirname, f);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/#10B981/ig, '#00C652');
    content = content.replace(/#059669/ig, '#00993B'); // hover color
    content = content.replace(/Emerald Green/ig, 'Vibrant Green');
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + f);
  } else {
    console.log('File not found: ' + f);
  }
});
