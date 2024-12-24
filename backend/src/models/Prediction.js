const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    drawNumber: {
        type: String,
        required: true,
        index: true
    },
    predictedNumbers: {
        red: {
            type: [Number],
            required: true,
            validate: {
                validator: function(arr) {
                    return arr.length === 6 && 
                           arr.every(num => num >= 1 && num <= 33);
                },
                message: '红球必须是6个1-33之间的数字'
            }
        },
        blue: {
            type: Number,
            required: true,
            min: 1,
            max: 16
        }
    },
    actualNumbers: {
        red: {
            type: [Number],
            validate: {
                validator: function(arr) {
                    return !arr.length || (arr.length === 6 && 
                           arr.every(num => num >= 1 && num <= 33));
                },
                message: '红球必须是6个1-33之间的数字'
            }
        },
        blue: {
            type: Number,
            min: 1,
            max: 16
        }
    },
    basis: {
        historicalAnalysis: String,
        patternAnalysis: String,
        comprehensiveAnalysis: String
    },
    hitCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// 索引
predictionSchema.index({ createdAt: -1 });
predictionSchema.index({ status: 1 });

// 静态方法
predictionSchema.statics.getHistory = function(limit = 10) {
    return this.find({ status: 'completed' })
        .sort({ createdAt: -1 })
        .limit(limit);
};

// 实例方法
predictionSchema.methods.calculateHitCount = function() {
    if (!this.actualNumbers.red || !this.actualNumbers.blue) {
        return 0;
    }

    const redHits = this.predictedNumbers.red.filter(num => 
        this.actualNumbers.red.includes(num)
    ).length;

    const blueHit = this.predictedNumbers.blue === this.actualNumbers.blue ? 1 : 0;

    return redHits + blueHit;
};

const Prediction = mongoose.model('Prediction', predictionSchema);

module.exports = Prediction; 