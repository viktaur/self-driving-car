"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Level_randomize;
class NeuralNetwork {
    constructor(neuronCounts) {
        this.levels = [];
        // create the levels
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
        }
    }
    static feedForward(givenInputs, network) {
        let outputs = Level.feedForward(givenInputs, network.levels[0]);
        // For every level, feed forward
        // outputs is reasigned on every level
        // When it reaches the last level the function will return its outputs
        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(outputs, network.levels[i]);
        }
        // console.log(outputs);
        return outputs;
    }
}
class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);
        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }
        __classPrivateFieldGet(Level, _a, "m", _Level_randomize).call(Level, this);
    }
    static feedForward(givenInputs, level) {
        // Set the values coming from the sensor (givenInputs) to each input node
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }
        // For each output node, calculate its value based on every input node and its weight
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }
            level.outputs[i] = sum > level.biases[i] ? 1 : 0;
        }
        return level.outputs;
    }
}
_a = Level, _Level_randomize = function _Level_randomize(level) {
    // Randomise the weights between the inputs and the outputs with a value between -1 and 1
    for (let i = 0; i < level.inputs.length; i++) {
        for (let j = 0; j < level.outputs.length; j++) {
            level.weights[i][j] = Math.random() * 2 - 1;
        }
    }
    // Randomise each bias (one for each output node) with a value between -1 and 1 
    for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = Math.random() * 2 - 1;
    }
};
