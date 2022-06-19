
      const width = window.innerWidth / 1.25;
      const height = window.innerHeight / 1.5;
      const barWidth = window.innerWidth / 10;
      const margins = {
        top: 70,
        right: 20,
        bottom: 40,
        left: 100,
      };

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
        .attr("width", width * 1.25)
        .attr("height", height);

      const subtitle1 = d3.select("div").append("text");

      const canvas = d3
        .select("div")
        .append("svg")
        .attr("width", width * 1.25)
        .attr("height", height);

      const total = "/Data/characterWordsData.csv";
      const act1 = "/Data/act1.csv";
      const act2 = "/Data/act2.csv";
      const act3 = "/Data/act3.csv";
      const act4 = "/Data/act4.csv";
      const act5 = "/Data/act5.csv";

      function updateChart(sourceFile) {
        d3.csv(sourceFile, function (d) {
          return {
            character: d.character,
            words: +d.words,
          };
        }).then((data) => {
          console.log("CSV Data: ", data);

          const subtitle2 = subtitle1
            .append("text")
            .text(function () {
              if (sourceFile == total) {
                return "Nombre total de mots prononcés par chaque personnage dans toute la pièce :";
              } else if (sourceFile == act1) {
                return "Nombre de mots prononcés par personnage dans l'acte I :";
              } else if (sourceFile == act2) {
                return "Nombre de mots prononcés par personnage dans l'acte II :";
              } else if (sourceFile == act3) {
                return "Nombre de mots prononcés par personnage dans l'acte III :";
              } else if (sourceFile == act4) {
                return "Nombre de mots prononcés par personnage dans l'acte IV :";
              } else if (sourceFile == act5) {
                return "Nombre de mots prononcés par personnage dans l'acte V :";
              }
            })
            .attr("class", "subtitle");

          const organise1 = d3.select("svg").attr("height", height);

          const y = d3
            .scaleLinear()
            .range([height - margins.top, margins.bottom]);

          y.domain([
            0,
            d3.max(data, function (d) {
              return d.words + d.words / 12;
            }),
          ]);

          const x = d3
            .scaleBand()
            .range([margins.left, width + margins.left + width / 60])
            .domain(
              data.map(function (d) {
                return d.character;
              })
            );

          const organise2 = organise1
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("transform", function () {
              return "translate(" + (margins.left + width / 60) + ", 0)";
            });

          organise2
            .append("rect")
            .attr("x", (d, i) => i * ("width", width / data.length))
            .attr("width", barWidth - 1)
            .attr("height", 0)
            .attr("y", y(0))
            .transition()
            .delay(function (d, i) {
              return 1000 + i * 1000;
            })
            .duration(1000)
            .attr("y", (d) => y(d.words))
            .attr("height", function (d) {
              return height - y(d.words) - margins.top;
            })
            .attr("fill", (d) => {
              if (d.character == "Junie") {
                return "#ACB4B8";
              } else if (d.character == "Narcisse") {
                return "#B87750";
              } else if (d.character == "Néron") {
                return "#F6E08B";
              } else if (d.character == "Burrhus") {
                return "#799A6F";
              } else if (d.character == "Agrippine") {
                return "#D15847";
              } else if (d.character == "Albine") {
                return "#F1DEB3";
              } else if (d.character == "Britannicus") {
                return "#E9A7AB";
              }
            })
            .attr("fill-opacity", 0.85)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("stroke-opacity", 0.85);

          organise1
            .append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + width * -2 + "," + y(0) + ")")
            .transition()
            .duration(1000)
            .attr("transform", "translate(0," + y(0) + ")")
            .call(d3.axisBottom(x))
            .selectAll("text");

          const yAxis = d3.axisLeft(y).ticks(10);

          organise1
            .append("g")
            .attr("class", "axis")
            .attr(
              "transform",
              "translate(" + margins.left + "," + height * 2 + ")"
            )
            .transition()
            .duration(1000)
            .attr("transform", "translate(" + margins.left + ",0)")
            .call(yAxis);

          organise1
            .selectAll("text")
            .attr("opacity", 0)
            .transition()
            .delay(1000)
            .duration(1000)
            .attr("opacity", 1);

          organise1
            .append("text")
            .attr("y", 0)
            .attr("x", -1 * (height / 1.5))
            .attr("transform", "rotate(-90)")
            .attr("dy", "-1em")
            .transition()
            .delay(1250)
            .duration(750)
            .attr("dy", "1.25em")
            .text("Nombre total de mots")
            .attr("class", "label");

          d3.select("svg")
            .append("text")
            .attr("y", height)
            .attr("x", width / 2 + margins.left / 2 - margins.right * 2)
            .attr("dy", "1em")
            .transition()
            .delay(1250)
            .duration(750)
            .attr("dy", "-0.75em")
            .text("Nom de personnage")
            .attr("class", "label");
        });
      }
      updateChart(total);

      d3.select("body").append("span").attr("text-align", "center");

      d3.select("span")
        .append("button")
        .attr("class", "buttonT")
        .on("click", function () {
          d3.selectAll("g").remove();
          d3.selectAll(".topic").remove();
          d3.selectAll(".dot").remove();
          d3.selectAll(".subtitle").remove();
          d3.selectAll(".label").remove();
          updateChart(total);
        });

      d3.select(".buttonT").append("text").text("Total").attr("class", "textT");

      d3.select("span")
        .append("button")
        .attr("class", "button1")
        .on("click", function () {
          d3.selectAll("g").remove();
          d3.selectAll(".topic").remove();
          d3.selectAll(".dot").remove();
          d3.selectAll(".subtitle").remove();
          d3.selectAll(".label").remove();
          updateChart(act1);
        });

      d3.select("span")
        .append("button")
        .attr("class", "button2")
        .on("click", function () {
          d3.selectAll("g").remove();
          d3.selectAll(".topic").remove();
          d3.selectAll(".dot").remove();
          d3.selectAll(".subtitle").remove();
          d3.selectAll(".label").remove();
          updateChart(act2);
        });

      d3.select("span")
        .append("button")
        .attr("class", "button3")
        .on("click", function () {
          d3.selectAll("g").remove();
          d3.selectAll(".topic").remove();
          d3.selectAll(".dot").remove();
          d3.selectAll(".subtitle").remove();
          d3.selectAll(".label").remove();
          updateChart(act3);
        });

      d3.select("span")
        .append("button")
        .attr("class", "button4")
        .on("click", function () {
          d3.selectAll("g").remove();
          d3.selectAll(".topic").remove();
          d3.selectAll(".dot").remove();
          d3.selectAll(".subtitle").remove();
          d3.selectAll(".label").remove();
          updateChart(act4);
        });

      d3.select("span")
        .append("button")
        .attr("class", "button5")
        .on("click", function () {
          d3.selectAll("g").remove();
          d3.selectAll(".topic").remove();
          d3.selectAll(".dot").remove();
          d3.selectAll(".subtitle").remove();
          d3.selectAll(".label").remove();
          updateChart(act5);
        });

      d3.select(".button1").append("text").text("Acte I");
      d3.select(".button2").append("text").text("Acte II");
      d3.select(".button3").append("text").text("Acte III");
      d3.select(".button4").append("text").text("Acte IV");
      d3.select(".button5").append("text").text("Acte V");