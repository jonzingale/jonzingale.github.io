import React, { PropTypes, Component } from 'react';
// import PageHeader from 'components/molecules/PageHeader';
import LorenzAttractor from 'components/explorables/lorenz/LorenzAttractor';
// import BriansBrain from 'components/explorables/blinky/BriansBrain';
// import Schelling from 'components/explorables/schelling/Schelling';

class Explorable extends React.Component {
            // <PageHeader title="Complexity is . . ." noimage subtitle="" />

   render() {
      return (
         <div>
            <div className="intro-text">
              Some mathematical models.
            </div>

            <Schelling />
            <LorenzAttractor />
            <BriansBrain />
         </div>
      );
   }
}

export default Explorable;
