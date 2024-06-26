import { add } from "../../src/calc";
import { expect } from "chai";

describe('tests in a subdirectory', () => {
  it('should be run', () => {

  });

  it('should add', () => {
    expect (add(3, 2)).to.eql(5);
  });

});
