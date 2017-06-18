import Utils from '../src/utils';

describe('formatBytes test', () => {
    describe('toBytes', () => {
        it('Converts an argument to the correct value and order of magnitude unit', (done) => {
            var result = Utils.formatBytes(102930912);
            assert.equal('98 MB', result);
            done();
        });
    });
});
