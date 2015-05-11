if (!(typeof MochaWeb === 'undefined')){
  MochaWeb.testOnly(function(){
    describe("Server", function() {

      var arraysAreEqual = function(a, b) {
        return a.length === b.length && a.every(function(elem, i) {
            return elem === b[i];
          });
      };

      describe("upload", function() {
        var upload = Server.upload;
        var init = upload.init;

        describe("init", function() {

          it("should have default properties", function () {
            var baseDir = process.env.PWD || '';
            chai.assert.equal(init.tmpDir, baseDir + '/.uploads/tmp');
            chai.assert.equal(init.uploadDir, baseDir + '/.uploads');
            chai.assert.equal(init.checkCreateDirectories, true);
            chai.assert.equal(init.maxFileSize, 2000000);
            chai.assert.equal(init.acceptFileTypes.toString(), (/.(gif|jpe?g|png)$/i).toString());
          });

          describe("getFileName", function() {

            it("should have default properties", function () {
              chai.assert.equal(false, true);
            });
          });
        });

        describe("delete", function() {
          it("should call fs.unlink with right file name", function () {
            var deletedFiles = [];
            fs.unlink = function(file) {
              deletedFiles.push(file);
            };
            upload.delete("XYZ.jpg");
            chai.assert.equal(deletedFiles.length, 1);
            chai.assert.equal(deletedFiles[0], init.uploadDir + "/XYZ.jpg");
          });
        });
      });

      describe("allow.owner", function() {
        var owner = Server.allow.owner;

        describe("insert", function() {

          it("should return false without userId", function () {
            var result = owner.insert(undefined, {});
            chai.assert.notOk(result);
          });

          it("should update document's owner with userId", function () {
            var doc = { owner: "AAA"};
            var result = owner.insert("XYZ", doc);
            chai.assert.ok(result);
            chai.assert.equal(doc.owner, "XYZ");
          });
        });

        describe("update", function() {

          it("should return false if userId doesn't match doc's owner", function () {
            var result = owner.update("1", { owner: "2" });
            chai.assert.notOk(result);
          });

          it("should return true if userId matches doc's owner", function () {
            var result = owner.update("1", { owner: "1" });
            chai.assert.ok(result);
          });
        });

        describe("remove", function() {

          it("should return false if userId doesn't match doc's owner", function () {
            var result = owner.remove("1", { owner: "2" });
            chai.assert.notOk(result);
          });

          it("should return true if userId matches doc's owner", function () {
            var result = owner.remove("1", { owner: "1" });
            chai.assert.ok(result);
          });
        });
      });
    });
  });
}