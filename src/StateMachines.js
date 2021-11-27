import * as THREE from "three";

class FiniteStateMachine {
  constructor() {
    this.states = {};
    this.currentState = null;
  }

  addState(name, type) {
    this.states[name] = type;
  }

  setState(name) {
    const prevState = this.currentState;

    if (prevState) {
      if (prevState.name === name) {
        return;
      }
      prevState.exit();
    }

    const state = new this.states[name](this);
    this.currentState = state;
    state.enter(prevState);
  }

  update(timeElapsed, input) {
    if (this.currentState) {
      this.currentState.update(timeElapsed, input);
    }
  }
}

export class CharacterFSM extends FiniteStateMachine {
  constructor(proxy) {
    super();
    this.proxy = proxy;
    this.init();
  }

  init() {
    this.addState("idle", IdleState);
    this.addState("walk", WalkState);
    this.addState("run", RunState);
    this.addState("dance", DanceState);
    this.addState("jump", JumpState);
  }
}

class State {
  constructor(parent) {
    this.parent = parent;
  }

  enter() {}
  exit() {}
  update() {}
}

class DanceState extends State {
  constructor(parent) {
    super(parent);
  }

  get name() {
    return "dance";
  }

  enter(prevState) {
    const currAction = this.parent.proxy.animations["dance"].action;
    const mixer = currAction.getMixer();

    mixer.addEventListener("finished", this.finished);

    if (prevState) {
      const prevAction = this.parent.proxy.animations[prevState.name].action;

      currAction.reset();
      currAction.setLoop(THREE.LoopOnce, 1);
      currAction.clampWhenFinished = true;
      currAction.crossFadeFrom(prevAction, 0.2, true);
      currAction.play();
    } else {
      currAction.play();
    }
  }

  finished = () => {
    this.cleanup();
    this.parent.setState("idle");
  };

  cleanup = () => {
    const action = this.parent.proxy.animations["dance"].action;

    action.getMixer().removeEventListener("finished");
  };

  exit() {
    this.cleanup();
  }

  update(_) {}
}

class JumpState extends State {
  constructor(parent) {
    super(parent);
  }

  get name() {
    return "jump";
  }

  enter(prevState) {
    const currAction = this.parent.proxy.animations["jump"].action;

    if (prevState) {
      const prevAction = this.parent.proxy.animations[prevState.name].action;

      currAction.enabled = true;

      if (prevState.name === "run") {
        const ratio =
          currAction.getClip().duration / prevAction.getClip().duration;
        currAction.time = prevAction.time * ratio;
      } else {
        currAction.time = 0.0;
        currAction.setEffectiveTimeScale(1.0);
        currAction.setEffectiveWeight(1.0);
      }

      currAction.crossFadeFrom(prevAction, 0.5, true);
      currAction.play();
    } else {
      currAction.play();
    }
  }

  exit() {}

  update(timeElapsed, input) {
    if (input.keys.space) {
      this.parent.setState("jump");
      return;
    }
    if (input.keys.forward || input.keys.backward) {
      if (input.keys.shift) {
        this.parent.setState("run");
      } else {
        this.parent.setState("walk");
      }
    }

    this.parent.setState("idle");
  }
}

class WalkState extends State {
  constructor(parent) {
    super(parent);
  }

  get name() {
    return "walk";
  }

  enter(prevState) {
    const currAction = this.parent.proxy.animations["walk"].action;

    if (prevState) {
      const prevAction = this.parent.proxy.animations[prevState.name].action;

      currAction.enabled = true;

      if (prevState.name === "run") {
        const ratio =
          currAction.getClip().duration / prevAction.getClip().duration;
        currAction.time = prevAction.time * ratio;
      } else {
        currAction.time = 0.0;
        currAction.setEffectiveTimeScale(1.0);
        currAction.setEffectiveWeight(1.0);
      }

      currAction.crossFadeFrom(prevAction, 0.5, true);
      currAction.play();
    } else {
      currAction.play();
    }
  }

  exit() {}

  update(timeElapsed, input) {
    if (input.keys.forward || input.keys.backward) {
      if (input.keys.shift) {
        this.parent.setState("run");
      }
      return;
    }
    if (input.keys.space) {
      this.parent.setState("idle");
      return;
    }

    this.parent.setState("idle");
  }
}

class RunState extends State {
  constructor(parent) {
    super(parent);
  }

  get name() {
    return "run";
  }

  enter(prevState) {
    const curAction = this.parent.proxy.animations["run"].action;
    if (prevState) {
      const prevAction = this.parent.proxy.animations[prevState.name].action;

      curAction.enabled = true;

      if (prevState.Name == "walk") {
        const ratio =
          curAction.getClip().duration / prevAction.getClip().duration;
        curAction.time = prevAction.time * ratio;
      } else {
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
      }

      curAction.crossFadeFrom(prevAction, 0.5, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  exit() {}

  update(timeElapsed, input) {
    if (input.keys.forward || input.keys.backward) {
      if (!input.keys.shift) {
        this.parent.setState("walk");
      }
      return;
    }
    if (input.keys.space) {
      this.parent.setState("idle");
      return;
    }

    this.parent.setState("idle");
  }
}

class IdleState extends State {
  constructor(parent) {
    super(parent);
  }

  get name() {
    return "idle";
  }

  enter(prevState) {
    const idleAction = this.parent.proxy.animations["idle"].action;
    if (prevState) {
      const prevAction = this.parent.proxy.animations[prevState.name].action;
      idleAction.time = 0.0;
      idleAction.enabled = true;
      idleAction.setEffectiveTimeScale(1.0);
      idleAction.setEffectiveWeight(1.0);
      idleAction.crossFadeFrom(prevAction, 0.5, true);
      idleAction.play();
    } else {
      idleAction.play();
    }
  }

  exit() {}

  update(_, input) {
    if (input.keys.forward || input.keys.backward) {
      this.parent.setState("walk");
      return;
    }
    if (input.keys.space) {
      this.parent.setState("idle");
    }
  }
}
