import {isJwtValid} from "../utils/jwt_utils";

describe('isJwtValid', () => {
  beforeEach(() => {
    localStorage.clear(); // eslint-disable-line no-undef
  });

  it('should return true for a valid token', () => {
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                       'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjozNzMxODg2Nzc5fQ.' +
                       'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    expect(isJwtValid(validToken)).toBe(true);
  });

  it('should return false for a token with an invalid structure', () => {
    const invalidStructureToken = 'invalid.token.structure';
    expect(isJwtValid(invalidStructureToken)).toBe(false);
  });

  it('should return false for a token with an unsupported algorithm', () => {
    const invalidAlgorithmToken = 'eyJhbGciOiJIUzI1niIsInR5cCI6IkpXVCJ9.' +
                                  'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNzMxODg2Nzc5fQ.' +
                                  'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    expect(isJwtValid(invalidAlgorithmToken)).toBe(false);
  });

  it('should return false for a token with an expired payload', () => {
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                         'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNjAxMjM0NTYyfQ.' +
                         'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    expect(isJwtValid(expiredToken)).toBe(false);
  });

  it('should delete the token from localStorage if it is invalid and del_invalid is true', () => {
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                         'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNjAxMjM0NTYyfQ.' +
                         'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    localStorage.setItem('access_token', expiredToken); // eslint-disable-line no-undef
    expect(isJwtValid(expiredToken, true)).toBe(false);
    expect(localStorage.getItem('access_token')).toBeNull();  // eslint-disable-line no-undef
  });

  it('should return false for a malformed token', () => {
    const malformedToken = 'thisisnotjwt';
    expect(isJwtValid(malformedToken)).toBe(false);
  });

  it('should return false for a token with no expiration field', () => {
    const noExpiryToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                          'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.' +
                          'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    expect(isJwtValid(noExpiryToken)).toBe(false);
  });
});
