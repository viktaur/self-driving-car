class NeuralNetwork {
    levels: Level[];

    constructor(neuronCounts: number[]) {
        this.levels = [];

        // create the levels
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
        }
    }

    static feedForward(givenInputs: number[], network: NeuralNetwork): number[] {
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

    inputs: number[];
    outputs: number[];
    biases: number[];
    weights: number[][];

    constructor(inputCount: number, outputCount: number) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);
    
        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        Level.#randomize(this);
    }

    static #randomize(level: Level) {

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
    }

    static feedForward(givenInputs: number[], level: Level) {

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

