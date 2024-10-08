const fs = require('fs');
const path = require('path');

// Helper function to calculate directory size by summing file sizes
function getDirectorySizeSync(dirPath) {
    const files = fs.readdirSync(dirPath);
    let totalSize = 0;
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.isFile() ? stats.size : getDirectorySizeSync(filePath);
    });
    return totalSize;
}

function directoryToTree(rootDir, depth) {
    const result = buildTree(rootDir, depth, 0);
    return result;
}

// Main recursive function to build the tree
function buildTree(currentDir, maxDepth, currentDepth) {
    const stats = fs.statSync(currentDir); // Get the stats for the current directory or file
    const isDirectory = stats.isDirectory();

    // Base structure for current node
    const node = {
        name: path.basename(currentDir), // File or directory name
        path: path.relative(process.cwd(), currentDir), // Relative path from the root directory
        type: isDirectory ? 'dir' : 'file',
        size: isDirectory ? getDirectorySizeSync(currentDir) : stats.size // Size of the directory or file
    };

    // Add children if it's a directory and depth allows further traversal
    if (isDirectory && currentDepth < maxDepth) {
        node.children = fs.readdirSync(currentDir)
            .map(child => path.join(currentDir, child)) // Get full paths for children
            .map(childPath => buildTree(childPath, maxDepth, currentDepth + 1)); // Recursive call for each child
    }

    return node;
}

module.exports = { directoryToTree };
