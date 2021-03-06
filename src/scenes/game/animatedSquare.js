import React, { PureComponent } from "react";
import { Animated } from "react-native";
import { Sound } from "../../classes/sound";
import { SettingsDecorator } from "../../decorators/settings";
import {
  sequence,
  parallel,
  AnimatedView,
  animate
} from "./animatedSquare.utilities";

const initial = {
  scale: 0.5,
  opacity: 0,
  rotate: -0.25
};

@SettingsDecorator()
export class AnimatedSquare extends PureComponent {
  animating = false;

  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(initial.opacity),
      scale: new Animated.Value(initial.scale),
      rotate: new Animated.Value(initial.rotate)
    };
    this.sounds = {
      correct: new Sound("tap_continue", props.settings.soundsEnabled),
      incorrect: new Sound("tap_stop", props.settings.soundsEnabled)
    };
  }

  /**
   * Animations
   */

  levelBegin = () => {
    return parallel([
      animate(this.state.opacity, 1, 250),
      animate(this.state.scale, 1, 250),
      animate(this.state.rotate, 0, 250)
    ]);
  };

  correct = () => {
    return sequence([
      parallel([
        sequence([
          animate(this.state.scale, 0.9, 125),
          animate(this.state.scale, 1, 125)
        ]),
        animate(this.state.rotate, 1.25, 850),
        animate(this.state.opacity, 0, 850)
      ]),
      parallel([
        animate(this.state.scale, initial.scale, 0),
        animate(this.state.rotate, initial.rotate, 0),
        animate(this.state.opacity, initial.opacity, 0)
      ])
    ]);
  };

  incorrect = () => {
    return sequence([
      sequence([
        animate(this.state.scale, 0.9, 125),
        animate(this.state.scale, 1, 125),
        animate(this.state.opacity, 0, 750)
      ]),
      parallel([
        animate(this.state.scale, initial.scale, 0),
        animate(this.state.rotate, initial.rotate, 0),
        animate(this.state.opacity, initial.opacity, 0)
      ])
    ]);
  };

  fadeOut = () => {
    return sequence([
      parallel([
        animate(this.state.scale, initial.scale, 500),
        animate(this.state.opacity, 0, 500)
      ]),
      parallel([
        animate(this.state.scale, initial.scale, 0),
        animate(this.state.rotate, initial.rotate, 0),
        animate(this.state.opacity, initial.opacity, 0)
      ])
    ]);
  };

  /**
   * Lifecycle
   */

  componentDidMount = () => {
    this.levelBegin().start();
  };

  shouldComponentUpdate = nextProps => {
    const { clicked, complete, fail, color } = nextProps;
    return (
      fail ||
      complete ||
      clicked !== this.props.clicked ||
      color !== this.props.color
    );
  };

  componentWillReceiveProps = nextProps => {
    const { clicked, status, complete, fail, color } = nextProps;

    if (
      (color !== this.props.color && !complete) ||
      (!clicked && !complete && !fail)
    ) {
      // new level & new color
      this.animating = false;
      this.levelBegin().start();
    } else if (fail && !this.props.clicked && clicked) {
      // fail & last square chosen
      this.animating = true;
      this.sounds.incorrect.play();
      this.incorrect().start();
      // why are we doing this?
      // to ensure we auto back on game over
      this.setState(state => state);
    } else if (fail) {
      // fail
      this.animating = true;
      this.fadeOut().start();
    } else if (complete && !this.props.clicked && clicked) {
      // complete & last square chosen
      this.animating = true;
      this.sounds.correct.play();
      this.correct().start();
    } else if (complete && !this.animating) {
      // complete
      this.animating = true;
      this.fadeOut().start();
    } else if (clicked && status && !this.animating) {
      // correct
      this.animating = true;
      this.sounds.correct.play();
      this.correct().start();
    } else if (clicked && !status && !this.animating) {
      // incorrect
      this.animating = true;
      this.sounds.incorrect.play();
      this.incorrect().start();
    }
  };

  render = () => {
    const rotateYValue = this.state.rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });

    const opacityValue = this.state.opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    return (
      <AnimatedView
        style={{
          flex: 1,
          margin: 4,
          borderRadius: 10,
          borderWidth: 2,
          borderBottomWidth: 0,
          borderRightWidth: 0,
          borderColor: "rgba(255, 255, 255, 0.15)",
          opacity: opacityValue,
          backgroundColor: this.props.color,
          transform: [
            { scale: this.state.scale },
            { rotateY: rotateYValue },
            { perspective: 1000 }
          ]
        }}
      />
    );
  };
}
