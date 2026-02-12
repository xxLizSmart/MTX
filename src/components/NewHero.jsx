import React from 'react';
import Spline from '@splinetool/react-spline';

const NewHero = () => {
  return (
    <section className="relative hidden sm:block w-full h-[400px] md:h-[600px] lg:h-[800px]">
      <Spline
        scene="https://prod.spline.design/OEkeZ5ocLzJyLc3M/scene.splinecode" 
      />
    </section>
  );
};

export default NewHero;