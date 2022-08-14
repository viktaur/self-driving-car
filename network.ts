class NeuralNetwork {
    levels: Array<Level>;

    constructor(neuronCounts: Array<number>) {
        this.levels = [];

        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
        }
    }

    static feedForward(givenInputs: Array<number>, network): Array<number> {
        let outputs = Level.feedForward(givenInputs, network.levels[0]);

        for (let i = 1; i< network.levels.length; i++) {
            outputs = Level.feedForward(outputs, network.levels[i]);
        }
        
        return outputs;
    }
}

class Level {

    inputs: Array<number>;
    outputs: Array<number>;
    biases: Array<number>;
    weights: Array<Array<number>>;

    constructor(inputCount: number, outputCount: number) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);
    
        this.weights = [];
        for (let i=0; i < inputCount; i++) {
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

    static feedForward(givenInputs: Array<number>, level: Level) {
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

