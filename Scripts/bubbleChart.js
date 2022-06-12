const width = window.innerWidth;
const height = window.innerHeight;
const margins = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
};

const colour = [
  "#617BB4",
  "#E9A7AB",
  "#997D89",
  "#D15847",
  "#ACB4B8",
  "#5B9F9E",
  "#799A6F",
  "#F6E08B",
  "#B87750",
];

const title = d3
  .select("body")
  .append("text")
  .text("MILLE SECRETS DE JEAN RACINE")
  .attr("class", "italics")
  .append("text")
  .text("Une analyse textuelle de BRITANNICUS")
  .attr("class", "title");

const division = d3
  .select("body")
  .append("div")
  .attr("width", width)
  .attr("height", height);

const subtitle1 = d3.select("div").append("text");

const canvas = d3
  .select("div")
  .append("svg")
  .attr("width", width - 50)
  .attr("height", height - height / 4 - 30)
  .attr("font-size", "20");

const dataSource1 = "/Data/nounsData.csv";
const dataSource2 = "/Data/verbsData.csv";

function updateChart(sourceFile) {
  d3.csv(sourceFile, function (d) {
    return {
      word: d.word,
      value: +d.value,
      group: d.group,
    };
  }).then((data) => {
    const datum = d3.map(data, (d) => d);
    const value = d3.map(data, (d) => d.value);
    const group = d3.map(data, (d) => d.group);
    const range = d3.range(value.length);
    const spectrum = d3.scaleOrdinal(group, colour);
    const word = d3.map(data, (d) => d.word);
    console.log("CSV Data: ", data);
    const hierarchy = d3.pack().padding(10).size([width, height])(
      d3.hierarchy({ children: range }).sum((i) => value[i])
    );

    const subtitle2 = subtitle1
      .append("text")
      .text(function (d) {
        if (sourceFile == dataSource2) {
          return "Verbes les plus fréquemment utilisés :";
        } else if (sourceFile == dataSource1) {
          return "Noms les plus fréquemment utilisés :";
        }
      })
      .attr("class", "subtitle");

    const two = canvas
      .selectAll("g")
      .enter()
      .data(hierarchy.leaves())
      .join("g")
      .attr(
        "transform",
        (d) =>
          "translate(" + d.x / 1.1 + "," + (d.y / 1.5 + height / 35) + ")"
      );

    two
      .append("circle")
      .attr("fill", function (d) {
        if (sourceFile == dataSource1) {
          return spectrum(group[d.data]);
        } else if (sourceFile == dataSource2) {
          return "black";
        }
      })
      .attr("fill-opacity", 0.85)
      .attr("stroke", function (d) {
        if (sourceFile == dataSource1) {
          return "black";
        } else if (sourceFile == dataSource2) {
          return "#ACB4B8";
        }
      })
      .attr("stroke-width", 1)
      .attr("r", 0)
      .transition()
      .delay(3000)
      .duration(1000)
      .attr("r", (d) => d.r);

    const unique = `O-${Math.random().toString(16).slice(2)}`;

    two
      .append("clipPath")
      .attr("id", (d) => unique + "-clip-" + d.data)
      .append("circle")
      .attr("r", (d) => d.r);

    two
      .append("text")
      .attr(
        "clip-path",
        (d) => `url(${new URL(`#${unique}-clip-${d.data}`, location)})`
      )
      .selectAll("tspan")
      .data((d) => `${word[d.data]}`.split(/\n/g))
      .join("tspan")
      .attr("x", 0)
      .attr("y", (d, i, datum) => i - datum.length / 2 + 0.75 + "em")
      .attr("text-anchor", "middle")
      .attr("fill", function (d) {
        if (sourceFile == dataSource1) {
          return "black";
        } else if (sourceFile == dataSource2) {
          return "#ACB4B8";
        }
      })
      .attr("fill-opacity", 0)
      .transition()
      .delay(4000)
      .duration(1000)
      .attr("fill-opacity", 1)
      .text((d) => d);

    const key = [
      "yeux",
      "amour",
      "règne",
      "famille",
      "misc.",
      "temps",
      "lieu",
      "foi",
      "parole",
    ];

    canvas
      .selectAll("dot")
      .data(key)
      .enter()
      .append("circle")
      .attr("cx", 10)
      .attr("cy", function (d, i) {
        return 40 + i * 25;
      })
      .attr("r", 7)
      .attr("fill", function (d) {
        return spectrum(d);
      })
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0)
      .transition()
      .duration(1000)
      .attr("stroke-opacity", function (d) {
        if (sourceFile == dataSource1) {
          return 1;
        } else if (sourceFile == dataSource2) {
          return 0;
        }
      })
      .attr("fill-opacity", 0)
      .transition()
      .delay(1000)
      .duration(1000)
      .attr("fill-opacity", function (d) {
        if (sourceFile == dataSource1) {
          return 1;
        } else if (sourceFile == dataSource2) {
          return 0;
        }
      })
      .attr("class", "dot");

    canvas
      .selectAll("topic")
      .data(key)
      .enter()
      .append("text")
      .attr("x", 27.5)
      .attr("y", function (d, i) {
        return 45 + i * 25;
      })
      .text(function (d) {
        return d;
      })
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
      .attr("fill-opacity", 0)
      .transition()
      .delay(1000)
      .duration(1000)
      .attr("fill-opacity", function (d) {
        if (sourceFile == dataSource1) {
          return 1;
        } else if (sourceFile == dataSource2) {
          return 0;
        }
      })
      .attr("class", "topic");

    canvas
      .append("text")
      .attr("y", height / 1.435)
      .attr("x", (d) => width / 2.15)
      .attr("dy", "2em")
      .transition()
      .delay(1250)
      .duration(750)
      .attr("dy", "0em")
      .attr("text-anchor", "middle")
      .text(function (d) {
        if (sourceFile == dataSource1) {
          return "Fréquence par rayon et centralité ; sujet par couleur";
        } else if (sourceFile == dataSource2) {
          return "Fréquence par rayon et centralité (sans verbes communs)";
        }
      })
      .attr("class", "label");
  });
}

updateChart(dataSource1);

d3.select("body").append("span").attr("text-align", "center");

d3.select("span")
  .append("button")
  .attr("class", "button1")
  .on("click", function () {
    d3.selectAll("g").remove();
    d3.selectAll(".topic").remove();
    d3.selectAll(".dot").remove();
    d3.selectAll(".label").remove();
    d3.selectAll(".subtitle").remove();
    updateChart(dataSource1);
  });

d3.select(".button1").append("text").text("Noms");

d3.select("span")
  .append("button")
  .attr("class", "button2")
  .on("click", function () {
    d3.selectAll("g").remove();
    d3.selectAll(".topic").remove();
    d3.selectAll(".dot").remove();
    d3.selectAll(".label").remove();
    d3.selectAll(".subtitle").remove();
    updateChart(dataSource2);
  });

d3.select(".button2").append("text").text("Verbes");