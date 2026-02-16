const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const projectRoot = path.join(__dirname, '..');
const distPath = path.join(projectRoot, 'dist');
const zipPath = path.join(projectRoot, 'lipilot-v1.0.zip');

function createZip() {
  console.log('📦 Creating extension ZIP file...\n');

  return new Promise((resolve, reject) => {
    // Check if dist folder exists
    if (!fs.existsSync(distPath)) {
      console.error('❌ dist folder not found. Please run "npm run build" first.');
      process.exit(1);
    }

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`✅ ZIP file created: ${zipPath}`);
      console.log(`   Size: ${sizeMB} MB`);
      console.log(`\n📤 Ready to upload to lipilot.com/install`);
      resolve();
    });

    archive.on('error', (err) => {
      console.error('❌ Error creating ZIP:', err);
      reject(err);
    });

    archive.pipe(output);

    // Add all files from dist folder
    function addDirectory(dir, baseDir = dir) {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          addDirectory(filePath, baseDir);
        } else {
          const relativePath = path.relative(baseDir, filePath);
          archive.file(filePath, { name: relativePath });
          console.log(`   Adding: ${relativePath}`);
        }
      }
    }

    addDirectory(distPath, distPath);
    archive.finalize();
  });
}

createZip().catch((error) => {
  console.error('Failed to create ZIP:', error);
  process.exit(1);
});

