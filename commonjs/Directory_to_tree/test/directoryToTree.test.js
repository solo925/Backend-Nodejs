const { directoryToTree } = require("../directoryToTree");

// Example: Serialize the structure of a directory to a depth of 5
const tree = directoryToTree("commonjs", 5);
console.log(JSON.stringify(tree, null, 2));

// Jest test case
describe('directoryToTree', () => {
    it('should generate a directory tree for the commonjs directory', () => {
        const expectedTree = {
            name: "commonjs",
            path: "commonjs",
            type: "dir",
            // ... rest of your expected structure
        };

        const result = directoryToTree("commonjs", 5);
        expect(result).toBeDefined(); // Basic check if result is defined
        expect(result).toEqual(expect.objectContaining({
            name: "commonjs",
            type: "dir",
        }));
    });
});
