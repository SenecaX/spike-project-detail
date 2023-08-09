import React, { useRef, useEffect } from "react";
import * as THREE from "three";

type LineChartThreeProps = {
  data: { name: string; temperature: number; crackmovement: number }[];
};

const LineChartThree: React.FC<LineChartThreeProps> = ({ data }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-450, 450, 250, -250, 1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(900, 500);
    ref.current?.appendChild(renderer.domElement);

    // Create temperature line
    const temperatureGeometry = new THREE.Geometry();
    data.forEach((item, index) => {
      temperatureGeometry.vertices.push(
        new THREE.Vector3(index * 30, item.temperature * 10, 0)
      );
    });
    const temperatureLine = new THREE.Line(
      temperatureGeometry,
      new THREE.LineBasicMaterial({ color: 0xff0000 })
    );
    scene.add(temperatureLine);

    // Create crackmovement line
    const crackmovementGeometry = new THREE.Geometry();
    data.forEach((item, index) => {
      crackmovementGeometry.vertices.push(
        new THREE.Vector3(index * 30, item.crackmovement * 10, 0)
      );
    });
    const crackmovementLine = new THREE.Line(
      crackmovementGeometry,
      new THREE.LineBasicMaterial({ color: 0x0000ff })
    );
    scene.add(crackmovementLine);

    // Render the scene
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  }, [data]);

  return <div ref={ref}></div>;
};

export default LineChartThree;
