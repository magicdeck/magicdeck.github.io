function prefix_sums(arr) {
  var new_arr = [];
  for (var i = 0; i < arr.length; i++) {
    new_arr[i] = 0;
    for (var j = 0; j < i + 1; j++) {
      new_arr[i] += arr[j];
    }
  }
  return new_arr;
}

function show (elem) {
    elem.style.display="block";
}

function hide (elem) {
    elem.style.display="";
}

class StatsView
{
    constructor()
    {
        this.dom = $$(div(),
          $$(div({class: 'main', style: 'border: 0px solid black; text-align: center; padding: 10px 0;'}),
            $$$(div(), "<b>Color Wheel</b>"),
            br(),
            this.colorWheel = div()
          ),
          br(),
          $$(div({class: 'main', style: 'border: 0px solid black; text-align: center; padding: 10px 0;'}),
            $$$(div(), "<b>Lands Wheel</b>"),
            br(),
            this.landsWheel = div({style: 'text-align: center; margin: auto;'})
          ),
          br(),
          this.status = div({class: 'main', style: 'border: 0px solid black; text-align: center; padding: 10px 0;'})
        );

      $('#stats').css('z-index', 1000);

      let colorWheelText = '<svg width="100" height="100" viewBox="0 0 100 100">' +
          '<path id="outerW" fill="none" stroke="ivory" stroke-width="20" title="WhitePowerTip"></path>' +
          '<path id="outerU" fill="none" stroke="steelblue" stroke-width="20" aria-label="Blue"></path>' +
          '<path id="outerB" fill="none" stroke="#1d1d1d" stroke-width="20"></path>' +
          '<path id="outerR" fill="none" stroke="firebrick" stroke-width="20"></path>' +
          '<path id="outerG" fill="none" stroke="mediumseagreen" stroke-width="20"></path>' +

          '<path id="innerW" fill="none" stroke="ivory" stroke-width="5"></path>' +
          '<path id="innerU" fill="none" stroke="steelblue" stroke-width="5"></path>' +
          '<path id="innerB" fill="none" stroke="#1d1d1d" stroke-width="5"></path>' +
          '<path id="innerR" fill="none" stroke="firebrick" stroke-width="5"></path>' +
          '<path id="innerG" fill="none" stroke="mediumseagreen" stroke-width="5"></path>' +
        '</svg>';
        this.colorWheel.innerHTML = colorWheelText;

      let landsWheelText = '<svg width="100" height="100" viewBox="0 0 100 100">' +
          '<path id="landsW" fill="none" stroke="ivory" stroke-width="20"></path>' +
          '<path id="landsU" fill="none" stroke="steelblue" stroke-width="20"></path>' +
          '<path id="landsB" fill="none" stroke="#1d1d1d" stroke-width="20"></path>' +
          '<path id="landsR" fill="none" stroke="firebrick" stroke-width="20"></path>' +
          '<path id="landsG" fill="none" stroke="mediumseagreen" stroke-width="20"></path>' +
        '</svg>';
      this.landsWheel.innerHTML = landsWheelText;
    }
  /*        
  '<path id="outerW" fill="aliceblue" stroke="azure" stroke-width="5"></path>' +
          '<path id="outerU" fill="royalblue" stroke="lightblue" stroke-width="5"></path>' +
          '<path id="outerB" fill="dimgray" stroke="black" stroke-width="5"></path>' +
          '<path id="outerR" fill="royalblue" stroke="red" stroke-width="5"></path>' +
          '<path id="outerG" fill="darkolivegreen" stroke="darkgreen" stroke-width="5"></path>' +

          '<path id="innerW" fill="aliceblue" stroke="azure" stroke-width="3"></path>' +
          '<path id="innerU" fill="royalblue" stroke="lightblue" stroke-width="3"></path>'
          '<path id="innerB" fill="royalblue" stroke="black" stroke-width="3"></path>'
          '<path id="innerR" fill="royalblue" stroke="red" stroke-width="3"></path>'
          '<path id="innerG" fill="royalblue" stroke="green" stroke-width="3"></path>'
*/
    getDom()
    {
        return this.dom;
    }

    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    describeArc(x, y, radius, startAngle, endAngle) {
        if (endAngle == 360) endAngle -= 1;
        startAngle = Math.min(startAngle, endAngle);
        endAngle = Math.max(startAngle, endAngle);

        var start = this.polarToCartesian(x, y, radius, endAngle);
        var end = this.polarToCartesian(x, y, radius, startAngle);

        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y

        ].join(" ");

        return d;
    }

    support_bold(value, supported) {
      if (supported.indexOf(value) != -1) {
        return '<b>' + value + '</b>';
      } else {
        return value;
      }
    }

    refresh(statsModel)
    {
        let stats_template = '<table width="100%">' +
        '<tr><th width="70%">Creatures:</th><td width="30%">{crits}</td></tr>' +
        '<tr><th>Other Spells:</th><td>{noncrits}</td></tr>' +
        '<tr><th>Lands:</th><td>{lands}</td></tr>' +
        '<tr><th>Total:</th><td>{all}</td></tr>' +
        '<tr><th>Sideboard:</th><td>{side}</td></tr>' +
        '</table>';
        let stats_text = stats_template.formatUnicorn(
            {
                crits: statsModel.creaturesCount,
                noncrits: statsModel.noncreaturesCount,
                lands: statsModel.landsCount,
                all: this.support_bold(statsModel.cards, [40, 60]),
                side: this.support_bold(statsModel.sideCount, [10, 15])
            });
      this.status.innerHTML = stats_text;

      const centerX = 50;
      const centerY = 50;
      const outerRadius = 40;
      const innerRadius = 16;

      const total = statsModel.costs.reduce(function(a, v){return a+v}, 0);
      const parts = prefix_sums(statsModel.costs);
      const arcs_ends = parts.map(function(el){ return el / total * 360.0; });
      const arcs_ranges = [0].concat(arcs_ends);

      const colorLabels = ['White', 'Blue', 'Black', 'Red', 'Green'];
      const outerLabels = ['outerW', 'outerU', 'outerB', 'outerR', 'outerG'];
      const innerLabels = ['innerW', 'innerU', 'innerB', 'innerR', 'innerG'];
      const landsLabels = ['landsW', 'landsU', 'landsB', 'landsR', 'landsG'];

      for(let i = 0; i < 5; i++) {
          document.getElementById(outerLabels[i]).setAttribute("d", this.describeArc(centerX, centerY, outerRadius, arcs_ranges[i], arcs_ranges[i+1]));
          tippy('#' + outerLabels[i], {content: "{color} Mana in Cost: {cost}/{total}".formatUnicorn({'color': colorLabels[i], 'cost': statsModel.costs[i], 'total': total})});
      }

      const total_inner = statsModel.inner_costs.reduce(function(a, v){return a+v}, 0);
      const parts_inner = prefix_sums(statsModel.inner_costs);
      const arcs_ends_inner = parts_inner.map(function(el){ return el / total_inner * 360.0; });
      const arcs_ranges_inner = [0].concat(arcs_ends_inner);

      for(let i = 0; i < 5; i++) {
          document.getElementById(innerLabels[i]).setAttribute("d", this.describeArc(centerX, centerY, innerRadius, arcs_ranges_inner[i], arcs_ranges_inner[i+1]));
          tippy('#' + innerLabels[i], {content: "{color} Mana in Text: {cost}/{total}".formatUnicorn({'color': colorLabels[i], 'cost': statsModel.inner_costs[i], 'total': total_inner})});
      }
      /*
      document.getElementById("innerW").setAttribute("d", this.describeArc(centerX, centerY, innerRadius, arcs_ranges_inner[0], arcs_ranges_inner[1]));
      document.getElementById("innerU").setAttribute("d", this.describeArc(centerX, centerY, innerRadius, arcs_ranges_inner[1], arcs_ranges_inner[2]));
      document.getElementById("innerB").setAttribute("d", this.describeArc(centerX, centerY, innerRadius, arcs_ranges_inner[2], arcs_ranges_inner[3]));
      document.getElementById("innerR").setAttribute("d", this.describeArc(centerX, centerY, innerRadius, arcs_ranges_inner[3], arcs_ranges_inner[4]));
      document.getElementById("innerG").setAttribute("d", this.describeArc(centerX, centerY, innerRadius, arcs_ranges_inner[4], arcs_ranges_inner[5]));
      */
      const total_lands = statsModel.lands.reduce(function(a, v){return a+v}, 0);
      const parts_lands = prefix_sums(statsModel.lands);
      const arcs_ends_lands = parts_lands.map(function(el){ return el / total_lands * 360.0; });
      const arcs_ranges_lands = [0].concat(arcs_ends_lands);

      const landsRadius = 40;
      /*
      document.getElementById("landsW").setAttribute("d", this.describeArc(centerX, centerY, landsRadius, arcs_ranges_lands[0], arcs_ranges_lands[1]));
      document.getElementById("landsU").setAttribute("d", this.describeArc(centerX, centerY, landsRadius, arcs_ranges_lands[1], arcs_ranges_lands[2]));
      document.getElementById("landsB").setAttribute("d", this.describeArc(centerX, centerY, landsRadius, arcs_ranges_lands[2], arcs_ranges_lands[3]));
      document.getElementById("landsR").setAttribute("d", this.describeArc(centerX, centerY, landsRadius, arcs_ranges_lands[3], arcs_ranges_lands[4]));
      document.getElementById("landsG").setAttribute("d", this.describeArc(centerX, centerY, landsRadius, arcs_ranges_lands[4], arcs_ranges_lands[5]));
      */

      for(let i = 0; i < 5; i++) {
          document.getElementById(landsLabels[i]).setAttribute("d", this.describeArc(centerX, centerY, landsRadius, arcs_ranges_lands[i], arcs_ranges_lands[i+1]));
          tippy('#' + landsLabels[i], {content: "{color} Mana from Lands: {cost}/{total}".formatUnicorn({'color': colorLabels[i], 'cost': statsModel.lands[i], 'total': total_lands})});
      }
    }
}
