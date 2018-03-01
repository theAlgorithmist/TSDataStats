/**
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
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

/**
 * Typescript Math Toolkit: Some basic statistics on a linear collection of numerical data.  Assign a data set and then
 * query various statistical measures. Lazy validation is used for most popular statistics to ensure that only the
 * required computations are performed on a JIT basis.  The algorithms used in each method are designed around the
 * needs of educational and business applications, i.e. the data sets are not massively large.  Note that some
 * computations may be less efficient than a textbook formula in order to protect against loss of significance and
 * issues with large numbers.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.1 (Added covariance matrix)
 */

export interface IFences
{
  lower: number;
  upper: number;
}

export interface IConfidence
{
  left: number;
  right: number;
}

export class TSMT$DataStats
{
  private _data: Array<number>;
  private _mean:number;
  private _std: number;
  private _median: number;
  private _mode: number;
  private _min: number;
  private _max: number;

  private _minInvalidated: boolean;
  private _maxInvalidated: boolean;
  private _meanInvalidated: boolean;
  private _stdInvalidated: boolean;
  private _medianInvalidated: boolean;
  private _modeInvalidated: boolean;

  constructor()
  {
    this._data   = new Array<number>(0);
    this._mean   = 0;
    this._std    = 0;
    this._median = 0;
    this._mode   = 0;
    this._min    = 0;
    this._max    = 0;

    this._minInvalidated    = true;
    this._maxInvalidated    = true;
    this._meanInvalidated   = true;
    this._stdInvalidated    = true;
    this._medianInvalidated = true;
    this._modeInvalidated   = true;
  }

  /**
   * Is the integer value even or odd?
   *
   * @param {number} n Integer value
   *
   * @returns {boolean} True if n is even and false if odd
   */
  public isEven(n: number): boolean
  {
    return (n & 1) == 0;
  }

  /**
   * Assign a data set for analysis
   *
   * @param {Array<number>} data Array of numerical values
   *
   * @returns {nothing}
   */
  public set data(dataProvider: Array<number>)
  {
    if (dataProvider === undefined || dataProvider == null || dataProvider.length === 0) {
      return;
    }

    this._data = dataProvider.slice();

    this._minInvalidated    = true;
    this._maxInvalidated    = true;
    this._meanInvalidated   = true;
    this._stdInvalidated    = true;
    this._medianInvalidated = true;
    this._modeInvalidated   = true;
  }

  /**
   * Access the number of samples in the data set
   *
   * @returns {number}
   */
  public get samples(): number
  {
    return this._data.length;
  }

  /**
   * Access the minimum value of this data set
   *
   * @returns {number} minimum value of data set
   */
  public get min(): number
  {
    const n: number = this._data.length;
    if (n == 0) {
      return 0;
    }

    if (this._minInvalidated)
    {
      let min: number = Number.MAX_VALUE;
      let i: number;

      for (i = 0; i < n; ++i)
      {
        if( this._data[i] < min ) {
          min = this._data[i];
        }
      }

      this._min = min;
    }

    return this._min;
  }

  /**
   * Access the maximum value of this data set
   *
   * @returns {number} maximum value of data set
   */
  public get max(): number
  {
    const n: number = this._data.length;
    if ( n == 0 ) {
      return 0;
    }

    if (this._maxInvalidated)
    {
      let max: number = Number.MIN_VALUE;
      let i: number;

      for (i = 0; i < n; ++i)
      {
        if( this._data[i] > max ) {
          max = this._data[i];
        }
      }

      this._max = max;
    }

    return this._max;
  }

  /**
   * Return the five-number summary of numeric data based on quartiles
   *
   * @returns {Array<number>} First element contains the min. number, second element contains the first quartile,
   * third element contains the median, fourth point contains the third quartile, and the final point contains the
   * max. number.  An empty array is returned if data is invalid.
   *
   * The algorithm used is as follows: The median is computed and if it is a datum (not an average of two middle values),
   * then the medium divides the data set into lower and upper halves and is included in each half.  The lower quartile
   * is the median of the lower data set and the upper quartile is the median of the upper data set.
   */
  public get fiveNumbers(): Array<number>
  {
    let n: number = this._data.length;
    if (n == 0) {
      return new Array<number>();
    }

    if (n == 1) {
      return [this._data[0], this._data[0], this._data[0], this._data[0], this._data[0]];
    }

    // sort data in ascending order
    let data: Array<number> = this._data.slice();
    data.sort(function(a, b){return a-b});

    let dataMin: number      = data[0];
    let dataMax: number      = data[n-1];
    let lower: Array<number> = new Array<number>();
    let upper: Array<number> = new Array<number>();

    let m: number;
    let dataMed: number;
    if (this.isEven(n))
    {
      m       = n/2 - 1;
      dataMed = 0.5*(data[m] + data[m+1]);
      lower   = data.slice(0,m+1);
      upper   = data.slice(m+1,n);
    }
    else
    {
      m       = (n+1)/2 - 1;
      dataMed = data[m];
      lower   = data.slice(0,m);
      upper   = data.slice(m+1,n);

      lower.push(dataMed);
      upper.unshift(dataMed);
    }

    // data is already sorted, so in-line the next two median computations
    n = lower.length;
    let lowerQuartile: number;
    let upperQuartile: number;

    if (this.isEven(n))
    {
      m = n/2 - 1;
      lowerQuartile = 0.5*(lower[m] + lower[m+1]);
    }
    else
    {
      m = (n+1)/2 - 1;
      lowerQuartile = lower[m];
    }

    n = upper.length;
    if (this.isEven(n))
    {
      m = n/2 - 1;
      upperQuartile = 0.5*(upper[m] + upper[m+1]);
    }
    else
    {
      m = (n+1)/2 - 1;
      upperQuartile = upper[m];
    }

    return [dataMin, lowerQuartile, dataMed, upperQuartile, dataMax];
  }

  /**
   * Return fences (lower/upper ranges) for the current data based on inter-quartile range for use in simple
   * outlier detection
   *
   * @returns IFences
   */
  public get fences(): IFences
  {
    let num: Array<number> = this.fiveNumbers;
    let q1: number         = num[1];
    let q3: number         = num[3];
    let iqr: number        = q3 - q1;

    return { lower:q1-1.5*iqr, upper:q3+1.5*iqr }
  }

  /**
   * Return the quantiles associated with the specified fraction
   *
   * @param {number} p Number in (0,1) indicating the quantile, i.e. 0.1 for deciles, 0.25 for quartiles.
   *
   * @returns {Array<number>} List of quantiles based on linear interpolation (note that result for quartiles may be different
   * from that in the five-number summary due to a different algorithm).  Quartiles are returned if the input is undefined
   * or out of range and an empty array is returned there is insufficient data in the array to define the necessary
   * quantiles.  The min value is always the first element and the max value is always the last element.  For example,
   * five values are returned in the event of p = 0.25 and 12 values are returned in the case of p = 0.1 .
   */
  public getQuantile(_p: number): Array<number>
  {
    let p: number = isNaN(_p) || _p < 0.01 || _p > 0.99 ? 0.25 : _p;

    let n: number      = this._data.length;
    let nQuant: number = Math.floor(1/p) ;

    if (n < 2) {
      return new Array<number>();
    }

    // fractions based on number of data points
    const f: Array<number> = new Array<number>(0.0);
    let n1: number         = 1.0/(n-1);
    let i: number;

    for (i = 1; i < n-1; ++i) {
      f[i] = f[i - 1] + n1;
    }

    f.push(1.0);

    let quantiles: Array<number> = new Array<number>();
    let data:Array<number>       = this._data.slice();
    data.sort( function(a, b){return a-b} );

    quantiles.push( data[0] );

    // have to compute nQuant-1 values, then add the max. value at the end
    n1            = n-1;
    let q: number = 0.0;
    let r: number;
    let t: number;
    let interp: number;

    for (i = 0; i < nQuant-1; ++i)
    {
      // current quantile
      q += p;

      // lower index at that quantile
      r = Math.floor(q*n1);

      if( Math.abs(f[r]-q) < 0.001 ) {
        quantiles.push(data[r]);
      }
      else
      {
        // compute t in (0,1) as parameter along f
        t = (q-f[r])/(f[r+1]-f[r]);

        // linearly interpolate to get the required value
        interp = (1.0-t)*data[r] + t*data[r+1];

        quantiles.push(interp);
      }
    }

    quantiles.push( data[data.length-1] );

    return quantiles;
  }

  /**
   * Compute the arithmetic mean of the supplied data set
   *
   * @returns {number} Mean of the data set
   */
  public get mean(): number
  {
    if (this._meanInvalidated)
    {
      let s:number   = this._data[0];
      const n: number = this._data.length;

      if( n == 0 ) {
        return 0;
      }

      let i: number;
      for (i = 1; i < n; ++i) {
        s += this._data[i];
      }

      this._mean = s/n;
      this._meanInvalidated = false;
    }

    return this._mean;
  }

  /**
   * Compute the geometric mean of the supplied data set
   *
   * @returns {number} Geometric mean of the data set; this is an infrequent computation, so invalidation is not used.
   * May return NaN if the product of data elements is negative (not typical for any practical application).
   */
  public get geometricMean(): number
  {
    let s: number   = this._data[0];
    const n: number = this._data.length;

    if (n == 0) {
      return 0;
    }

    let i: number;
    for (i = 1; i < n; ++i) {
      s *= this._data[i];
    }

    return Math.pow(s, 1/n);
  }

  /**
   * Compute the harmonic mean of the supplied data set
   *
   * @returns {number} Harmonic mean of the data set; this is an infrequent computation, so invalidation is not used.
   */
  public get harmonicMean(): number
  {
    const n: number = this._data.length;
    if (n == 0) {
      return 0;
    }

    let s: number = Math.abs(this._data[0]) > 0.000000001 ? 1/this._data[0] : 0;
    let r: number;
    let i: number;
    for (i = 1; i < n; ++i)
    {
      r  = Math.abs(this._data[i]) > 0.000000001 ? 1/this._data[i] : 0;
      s += r;
    }

    return n/s;
  }

  /**
   * Compute the standard deviation of the supplied data set
   *
   * @returns {number} Standard deviation of the data set.  Welford's method is used for superior numerical stability
   * at the cost of less computational efficiency.
   */
  public get std(): number
  {
    if (this._stdInvalidated)
    {
      const n: number = this._data.length;
      if (n == 1) {
        return 0;
      }

      // Welford's method - has more divides, but is more numerically stable
      let i: number;
      let m_old: number = 0;
      let m: number     = 0;
      let s: number     = 0;
      let d: number;

      for (i = 0; i < n; ++i)
      {
        m_old = m;
        d     = (this._data[i] - m_old);
        m     = m + d/(i+1);
        s     = s + (this._data[i] - m)*d;
      }

      this._std = Math.sqrt( s/(n-1) );
      this._stdInvalidated = false;
    }

    return this._std;
  }

  /**
   * Compute the coefficient of variation of the supplied data set
   *
   * @returns {number}
   */
  public get cv(): number
  {
    const s = this.std;
    const m = this.mean;

    return (s/m)*100;
  }

  /**
   * Compute the median of the supplied data set
   *
   * @returns {number}
   */
  public get median(): number
  {
    if (this._medianInvalidated)
    {
      const n: number = this._data.length;
      if (n == 0) {
        return 0;
      }

      const tmp: Array<number> = this._data.slice();

      // sort in ascending order
      tmp.sort( function(a, b){return a-b} );

      let m: number;
      if (this.isEven(n))
      {
        m = n/2 - 1;
        this._median = 0.5*(tmp[m] + tmp[m+1]);
      }
      else
      {
        m = (n+1)/2 - 1;
        this._median = tmp[m];
      }

      this._medianInvalidated = false;
    }

    return this._median;
  }

  /**
   * Compute the mode of the supplied data set
   *
   * @returns {number}
   */
  public get mode(): number
  {
    if (this._modeInvalidated)
    {
      const n: number = this._data.length;
      if (n == 0) {
        return 0;
      }

      const hash: Object = {};
      let x: string      = "";
      let i: number;

      for (i = 0; i < n; ++i)
      {
        x = this._data[i].toString();

        if (hash.hasOwnProperty(x) )
          hash[x]++;
        else
          hash[x] = 1;
      }

      let count: number = -1;
      let value: string;
      for (value in hash)
      {
        if (hash[value] > count)
        {
          count      = hash[value];
          this._mode = parseInt(value);
        }
      }

      this._modeInvalidated = false;
    }

    return this._mode;
  }

  /**
   * Compute the confidence limits on the current data set given a confidence factor
   *
   * @param {number} t Confidence factor in (0,1), i.e. 95% confidence is t = 0.95.  The classic 90% confidence
   * interval is t = .9.
   *
   * @return IConfidence Left and right confidence intervals at the specified confidence level.
   */
  public getConfidenceInterval(_t: number): IConfidence
  {
    let t: number = isNaN(_t) ? 0.9 : _t;
    t             = Math.max(0.01,t);
    t             = Math.min(t, 0.99);

    if (this._data.length == 0) {
      return {left: 0, right: 0};
    }

    let n: number = this._data.length;
    let s: number = this.std;
    let u: number = this.mean;
    let d: number = t*s/Math.sqrt(n);

    return {left: u-d, right: u+d};
  }

  /**
   * Return the skewness of the supplied data set
   *
   * @returns {number} Sample skewness (adjusted from population skewness estimate)
   */
  public get skewness(): number
  {
    let n: number = this._data.length;
    if (n < 3) {
      return 0;
    }

    const mult: number = Math.sqrt( n*(n-1) )/(n-2);
    const u: number    = this.mean;
    const s: number    = this.std;

    let s1: number = 0;
    let i: number;
    let z: number;

    for (i = 0; i < n; ++i)
    {
      z   = this._data[i] - u;
      s1 += z*z*z;
    }

    let skew: number = (s1/n) / (s*s*s);
    return mult*skew;
  }

  /**
   * Return the kurtosis of the supplied data set
   *
   * @returns {number} Sample excess kurtosis
   */
  public get kurtosis(): number
  {
    const n: number = this._data.length;
    if (n < 4) {
      return 0;
    }

    const u: number  = this.mean;
    const s: number  = this.std;
    let s1: number = 0;
    let i: number;
    let z: number;

    for (i = 0; i < n; ++i)
    {
      z   = this._data[i] - u;
      s1 += z*z*z*z;
    }

    const n1: number = n-1;
    const n2: number = n-2;
    const n3: number = n-3;
    const a: number  = ( (n*(n+1)*s1) ) / ( n1*n2*n3*s*s*s*s );
    const b: number  = 3*n1*n1/(n2*n3);

    return a-b;
  }

  /**
   * Return the (sample) covariance of two numerical data sets
   *
   * @param {Array<number>} x First data set (n samples)
   *
   * @param {Array<number>} y Second data set (n samples)
   *
   * @returns {number} Sample Cov(x,y) or zero if inputs are invalid
   */
  public covariance(x: Array<number>, y: Array<number>): number
  {
    if (x === undefined || x == null || y === undefined || y == null) {
      return 0.0;
    }

    const n: number = x.length;
    if (n < 2 || n != y.length) {
      return 0.0;
    }

    this.data           = x.slice();
    const xmean: number = this.mean;

    this.data           = y.slice();
    const ymean: number = this.mean;

    let i: number;
    let xs: number = 0.0;
    let ys: number = 0.0;
    let s: number  = 0.0;

    for (i = 0; i < n; ++i)
    {
      xs = x[i] - xmean;
      ys = y[i] - ymean;
      s += xs*ys;
    }

    return s/(n-1.0);
  }

  /**
   * Return the Pearson correlation coefficient of two numerical data sets
   *
   * @param {Array<number>} x First data set (n samples)
   *
   * @param {Array<number>} y  Second data set (n samples)
   *
   * @returns {number} Pearson correlation coefficient, r,  or zero if inputs are invalid
   */
  public correlation(x: Array<number>, y: Array<number>): number
  {
    if (x === undefined || x == null || y === undefined || y == null) {
      return 0.0;
    }

    const n: number = x.length;
    if (n < 2 || n != y.length) {
      return 0.0;
    }

    this.data        = x;
    const xs: number = this.std;

    this.data        = y;
    const ys: number = this.std;

    return this.covariance(x,y)/(xs*ys);
  }

  /**
   * Compute the covariance matrix of the Array of random variable measurements
   *
   * @param {Array<Array<number>>} x Two-dimensional array where each column represents a number of samples
   * of a single quantity, i.e. test score
   *
   * @returns {Array<Array<number>>} Covariance matrix, i.e. variances along the main diagonal and covariances
   * in the off-diagonal elements.  The full lower triangle is returned as the matrix is known to by symmetric.
   */
  public covarianceMatrix(x: Array<Array<number>>): Array<Array<number>>
  {
    if (x === undefined || x == null || (x.hasOwnProperty('length') && x.length == 0)) {
      return [];
    }

    const m: number = x.length;    // number of rows or sample count
    const n: number = x[0].length; // number of columns or individual categories to be correlated
    const s: number = 1.0/m;       // inverse of sample count

    // the cov matrix will be n x n
    let cov: Array<Array<number>> = new Array<Array<number>>();
    let i: number;
    let j: number;

    for (j = 0; j < n; ++j)
    {
      // only need to fill out the full lower triangle
      cov[j] = new Array<number>(j+1).fill(0.0);
    }

    // matrix-matrix product, S = 1/m * (I' x X) where I' is the mxn identity - now, only n of the sums is unique;
    // that vector is simply copied from row to row in the subsequent matrix subtraction
    const sums: Array<number> = new Array<number>();

    for (j = 0; j < n; ++j)
    {
      sums[j] = 0.0;

      for (i = 0; i < m; ++i)
      {
        sums[j] += x[i][j];
      }

      sums[j] *= s;
    }

    // C = X - S, but compute/store the result column-major
    let C: Array<Array<number>> = new Array<Array<number>>();
    for (j = 0; j < n; ++j)
    {
      C.push( new Array<number>() );

      let cj: Array<Number> = C[j];
      for (i = 0; i < m; ++i)
      {
        // re-use the sums array
        cj.push( x[i][j] - sums[j] );
      }
    }

    // inline C^T x C; the matrix will be symmetric, so it's only necessary to compute the full lower triangle
    let k: number;
    let sum: number;

    for (i = 0; i < n; ++i)
    {
      let ci: Array<number> = C[i];

      for (j = 0; j <= i; ++j)
      {
        let cj: Array<number> = C[j];
        sum                   = 0.0;

        for (k = 0; k < m; ++k)
        {
          sum += ci[k]*cj[k];
        }

        cov[i][j] = sum;
      }
    }

    // C := C x (1/m) (scalar product)
    for (i = 0; i < n; ++i)
    {
      for (j = 0; j <= i; ++j)
      {
        // scale by inverse of sample count
        cov[i][j] *= s;
      }
    }

    return cov;
  }
}
