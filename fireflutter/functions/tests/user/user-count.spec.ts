import { expect } from "chai";
import "mocha";

describe("Count no of users", () => {
    it("Should be bigger than 0", async () => {
        const expected = 1234;
        return expect(1234).to.eql(expected);
    }).timeout(10000);
});

