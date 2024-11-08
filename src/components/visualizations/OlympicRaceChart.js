import React, { useEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const OlympicRaceChart = ({ dataSource }) => {
  const chartRef = useRef(null);
  const stepDuration = 1000; // Reduced from 2000 to make it smoother

  useEffect(() => {
    const root = am5.Root.new("chartdiv");

    // Configure animations
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    // Configure number formatting
    root.numberFormatter.setAll({
      numberFormat: "#a",
      bigNumberPrefixes: [
        { number: 1e3, suffix: "K" },
        { number: 1e6, suffix: "M" }
      ],
      smallNumberPrefixes: []
    });

    const chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none",
      paddingLeft: 0,
      paddingRight: 40
    }));

    // Create axes with smooth transitions
    const yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 20,
      inversed: true,
      cellStartLocation: 0.1,
      cellEndLocation: 0.9
    });
    yRenderer.grid.template.set("visible", false);
    
    yRenderer.labels.template.setAll({
      fontSize: 16,
      fontWeight: "400",
      paddingRight: 10
    });

    const yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0,
      categoryField: "category",
      renderer: yRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));

    const xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: 0,
      strictMinMax: true,
      extraMax: 0.1,
      renderer: am5xy.AxisRendererX.new(root, {})
    }));

    // Configure smooth interpolation
    xAxis.set("interpolationDuration", stepDuration / 2);
    xAxis.set("interpolationEasing", am5.ease.linear);

    const series = chart.series.push(am5xy.ColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "value",
      categoryYField: "category",
      interpolationDuration: stepDuration,
      interpolationEasing: am5.ease.linear,
      sequencedInterpolation: false // Important for smooth transitions
    }));

    series.columns.template.setAll({
      cornerRadiusBR: 5,
      cornerRadiusTR: 5,
      strokeOpacity: 0,
      height: am5.percent(30),
      templateField: "columnSettings"
    });

    // Set colors with transition
    series.columns.template.adapters.add("fill", (fill, target) => {
      return target.dataItem.get("categoryY") === "Male Athletes" 
        ? am5.color("#3C3B6E") 
        : am5.color("#DB2777");
    });

    series.bullets.push(() => {
      return am5.Bullet.new(root, {
        locationX: 1,
        sprite: am5.Label.new(root, {
          text: "{valueX}",
          fill: root.interfaceColors.get("alternativeText"),
          centerX: am5.p100,
          centerY: am5.p50,
          populateText: true,
          fontSize: 16
        })
      });
    });

    const yearLabel = chart.plotContainer.children.push(am5.Label.new(root, {
      text: "1896",
      fontSize: "5em",
      opacity: 0.15,
      x: am5.p100,
      y: am5.p100,
      centerY: am5.p100,
      centerX: am5.p100
    }));

    const loadData = async () => {
      try {
        const response = await fetch(dataSource);
        const csvText = await response.text();
        
        const rows = csvText.split('\n');
        const headers = rows[0].split(',');
        const data = rows.slice(1)
          .filter(row => row.trim())
          .map(row => {
            const values = row.split(',');
            return headers.reduce((obj, header, index) => {
              obj[header.trim()] = values[index];
              return obj;
            }, {});
          });

        // Initial setup
        let currentIndex = 0;
        const animateData = () => {
          if (currentIndex >= data.length) {
            currentIndex = 0; // Reset for loop
          }

          const row = data[currentIndex];
          const chartData = [
            { 
              category: "Male Athletes",
              value: parseInt(row.maleCount),
              valueY: 0
            },
            {
              category: "Female Athletes",
              value: parseInt(row.femaleCount),
              valueY: 1
            }
          ].sort((a, b) => b.value - a.value);

          // Update data with smooth transition
          yearLabel.animate({
            key: "text",
            to: row.year,
            duration: stepDuration / 2
          });

          series.data.setAll(chartData);
          yAxis.data.setAll(chartData);

          // Animate position changes
          series.columns.template.states.create("default", {
            interpolationDuration: stepDuration,
            interpolationEasing: am5.ease.linear
          });

          currentIndex++;
        };

        // Initial data
        animateData();

        // Set up smooth continuous animation
        const interval = setInterval(animateData, stepDuration);
        chartRef.current = interval;

      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();

    // Initial animations
    series.appear(stepDuration);
    chart.appear(stepDuration, 100);

    return () => {
      if (chartRef.current) {
        clearInterval(chartRef.current);
      }
      root.dispose();
    };
  }, [dataSource]);

  return (
    <div className="w-full bg-white p-4">
      <h1 className="text-2xl font-light mb-6">
        Evolution of Gender Distribution in the Olympics (1896-2024)
      </h1>
      <div id="chartdiv" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

export default OlympicRaceChart;