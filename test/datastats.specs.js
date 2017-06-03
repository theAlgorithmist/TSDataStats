"use strict";
/** Copyright 2016 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Specs for TSMT Basic Data Statistics
var DataStats_1 = require("../src/DataStats");
var Chai = require("chai");
var expect = Chai.expect;
// Test Suites
describe('TSMT Basic Data Stats', function () {
    it('does not accept a null data provider', function () {
        var myStats = new DataStats_1.TSMT$DataStats();
        myStats.data = null;
        expect(myStats.samples).to.equal(0);
    });
    it('does not accept a zero-length data provider', function () {
        var myStats = new DataStats_1.TSMT$DataStats();
        myStats.data = [];
        expect(myStats.samples).to.equal(0);
    });
    it('reports correct sample count for a singleton data provider', function () {
        var myStats = new DataStats_1.TSMT$DataStats();
        myStats.data = [1.0];
        expect(myStats.samples).to.equal(1);
    });
    it('reports correct min/max/mean/median for a singleton data provider', function () {
        var myStats = new DataStats_1.TSMT$DataStats();
        myStats.data = [1.0];
        expect(myStats.min).to.equal(1);
        expect(myStats.max).to.equal(1);
        expect(myStats.mean).to.equal(1);
        expect(myStats.median).to.equal(1);
    });
    it('reports correct mean/median/mode for small dataset', function () {
        var myStats = new DataStats_1.TSMT$DataStats();
        myStats.data = [60, 64, 70, 70, 70, 75, 80, 90, 95, 95, 100];
        expect(myStats.mean).to.equal(79);
        expect(myStats.median).to.equal(75);
        expect(myStats.mode).to.equal(70);
    });
    it('reports correct mean/median/mode/std for small dataset #2', function () {
        var myStats = new DataStats_1.TSMT$DataStats();
        myStats.data = [17, 12, 14, 17, 13, 16, 18, 20, 13, 12,
            12, 17, 16, 15, 14, 12, 12, 13, 17, 14,
            15, 12, 15, 16, 12, 18, 20, 19, 12, 15,
            18, 14, 16, 17, 15, 19, 12, 13, 12, 15
        ];
        expect(myStats.mean).to.equal(14.975);
        expect(myStats.median).to.equal(15);
        expect(myStats.mode).to.equal(12);
        expect(Math.abs(myStats.std - 2.496) < 0.001).to.be.true;
    });
    it('reports correct mean/std for larger dataset', function () {
        var myStats = new DataStats_1.TSMT$DataStats();
        myStats.data = [-0.17153201811526, -0.24688253248949, 0.11338441630439, 0.21688342552633, -0.011673274048979,
            -0.02003736435437, -0.34336588850306, 0.078405646177621, -0.065555801648822, 0.028825789263126,
            0.042177644981986, -0.50528595024946, -0.4273793332064, 0.3017619807293, 0.040940131180399,
            0.12162445946489, 0.046924000912204, -0.31441861873484, -0.24797010811493, -0.31245115727514,
            0.36179798762062, -0.46964621705612, 0.1159236116096, 0.44229719468743, 0.17553670198059,
            -0.049653531282555, 0.035737645461893, -0.52367570682749, 0.12014526093805, -0.2060419038672,
            -0.12789255250514, -0.19007839020849, -0.17402649310177, 0.12573206620924, 0.2646133618755,
            0.41670972482352, 0.030866480670971, 0.07031579787869, -0.085545940939841, 0.34396444357458,
            -0.34488388941556, 0.15597328456662, -0.39937390581988, 0.12960169981417, 0.26218698256904,
            -0.1620734969907, -0.028376561029554, -0.080399756342166, 0.14758867251726, -0.23720637932878,
            -0.27695138789864, 0.05257578120839, 0.21722344584028, 0.19122661193002, -0.20626312001628,
            -0.059435335753833, -0.1995971405858, -0.23267982758906, 0.33527000452094, 0.043882296754041,
            -0.07738562758975, 0.5515265183042, 0.34121467746293, 0.011521247389367, 0.17429773253761,
            -0.22635967501679, 0.15713909187964, -0.1787810576828, -0.34801215785823, -0.082164064211855,
            0.64074819328462, -0.044302007836004, -0.38284231659945, -0.41366498500892, -0.15964965729918,
            0.39248247734553, -0.12031750238867, -0.16930717524153, -0.40060591948563, 0.0068312326939647,
            -0.1898421274294, 0.44393250846458, 0.029613400394471, -0.22581182588274, 0.02045533910155,
            0.11398918107627, -0.20562256981737, 0.11476536764274, -0.32378382765313, -0.09196424943184,
            0.17281588794572, -0.35251113939319, 0.073961983637722, 0.11265707197549, -0.317176214879,
            0.091016285581571, -0.14930773416087, 0.047940214497312, -0.13754460419439, -0.078689419991652
        ];
        expect(Math.abs(myStats.mean - -0.0287) < 0.001).to.be.true;
        expect(Math.abs(myStats.std - 0.2447) < 0.001).to.be.true;
    });
    it('reports correct geometric mean #1', function () {
        var myStats = new DataStats_1.TSMT$DataStats();
        myStats.data = [10, 51.2, 8];
        expect(Math.abs(myStats.geometricMean - 16) < 0.0000001).to.be.true;
    });
    it('reports correct geometric mean #2', function () {
        var myStats = new DataStats_1.TSMT$DataStats();
        myStats.data = [1, 3, 9, 27, 81];
        expect(Math.abs(myStats.geometricMean - 9) < 0.0000001).to.be.true;
    });
    it('reports correct harmonic mean #1', function () {
        var myStats = new DataStats_1.TSMT$DataStats();
        myStats.data = [100, 110, 90, 120];
        expect(Math.abs(myStats.harmonicMean - 103.8) < 0.01).to.be.true;
    });
    it('reports correct harmonic mean #2', function () {
        var myStats = new DataStats_1.TSMT$DataStats();
        myStats.data = [13.2, 14.2, 14.8, 15.2, 16.1];
        expect(Math.abs(myStats.harmonicMean - 14.63) < 0.01).to.be.true;
    });
    it('reports correct skewness #1', function () {
        var myStats = new DataStats_1.TSMT$DataStats();
        myStats.data = [61, 61, 61, 61, 61, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
            67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
            67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70,
            70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 73, 73, 73, 73, 73, 73, 73, 73
        ];
        expect(Math.abs(myStats.skewness - -.108) < 0.001).to.be.true;
    });
    it('reports correct skewness and kurtosis', function () {
        var myStats = new DataStats_1.TSMT$DataStats();
        myStats.data = [2, 5, -1, 3, 4, 5, 0, 2];
        expect(Math.abs(myStats.skewness - -.35) < 0.01).to.be.true;
        expect(Math.abs(myStats.kurtosis - -.94) < 0.01).to.be.true;
    });
    it('reports correct sample covariance', function () {
        var myStats = new DataStats_1.TSMT$DataStats();
        var cov = myStats.covariance([2.1, 2.5, 4.0, 3.6], [8, 12, 14, 10]);
        expect(Math.abs(cov - 1.53) < 0.01).to.be.true;
    });
    it('reports correct Pearson corr. coef.', function () {
        var myStats = new DataStats_1.TSMT$DataStats();
        var corr = myStats.correlation([43, 21, 25, 42, 57, 59, 247], [99, 65, 79, 75, 87, 81, 486]);
        expect(Math.abs(corr - 0.98761) < 0.0001).to.be.true;
    });
});
