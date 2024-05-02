import * as d3 from 'd3';

export default class LineGraph {
  private points: [number, number][] = [];
  private svg:
    | d3.Selection<SVGSVGElement, unknown, null, undefined>
    | undefined;
  private line: d3.Line<[number, number]>;
  private xScale: d3.ScaleLinear<number, number>;
  private yScale: d3.ScaleLinear<number, number>;

  constructor() {
    this.line = d3.line();
    // Setup scales
    this.xScale = d3.scaleLinear().domain([2020, 2050]).range([0, 800]);
    this.yScale = d3.scaleLinear().domain([0, 100]).range([600, 0]);
  }

  initialize(svgElement: SVGSVGElement) {
    this.svg = d3
      .select(svgElement)
      .attr('width', 800)
      .attr('height', 600)
      .style('border', '1px solid black');

    this.svg.on('click', (event: MouseEvent) => {
      // Use event passed from the listener
      console.log('inside on click');
      if (!this.svg) {
        console.log('SVG is null2');
        return; // Guard clause if svg is null
      }
      const [x, y] = d3.pointer(event, this.svg.node());
      const year = Math.round(this.xScale.invert(x));
      const value = this.yScale.invert(y);
      console.log('year:', year, 'value:', value);
      this.addPoint([year, value]);
      console.log('after add point');
      this.updateGraph();
      console.log('after update');
      this.updatePoints();
    });

    // this.svg.on('click', () => {
    //     const [x, y] = d3.pointer(event, this.svg.node());
    //     const year = Math.round(this.xScale.invert(x));
    //     const value = this.yScale.invert(y);
    //     this.points.push([year, value]);
    //     this.update();
    // });
  }

  updatePoints() {
    // This should be overridden by the React component
  }

  addPoint(point: [number, number]): void {
    console.log('inside add point');
    this.points.push(point);
  }

  getPoints(): [number, number][] {
    return this.points;
  }

  updateGraph() {
    console.log('update called');
    if (!this.svg) {
      console.log('SVG is null');
      return; // Guard clause if svg is null
    }
    console.log('Updating graph');
    this.svg
      .selectAll('circle')
      .data(this.points)
      .join('circle')
      .attr('cx', (d) => this.xScale(d[0]))
      .attr('cy', (d) => this.yScale(d[1]))
      .attr('r', 5)
      .style('fill', 'red')
      .style('stroke', 'black')
      .style('stroke-width', 2);

    this.svg
      .selectAll('path')
      .data([this.points])
      .join('path')
      .attr(
        'd',
        this.line.x((d) => this.xScale(d[0])).y((d) => this.yScale(d[1]))
      )
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', 2);
  }
}
