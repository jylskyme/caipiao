const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['frequency', 'distribution', 'missing'],
        unique: true
    },
    data: {
        frequency: {
            red: {
                type: Map,
                of: Number
            },
            blue: {
                type: Map,
                of: Number
            }
        },
        distribution: {
            ranges: [String],
            counts: [Number]
        },
        missing: [{
            number: Number,
            currentMissing: Number,
            maxMissing: Number,
            avgMissing: Number
        }]
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// 索引
statisticsSchema.index({ type: 1 });
statisticsSchema.index({ lastUpdated: -1 });

// 静态方法
statisticsSchema.statics.getFrequencyStats = function() {
    return this.findOne({ type: 'frequency' });
};

statisticsSchema.statics.getDistributionStats = function() {
    return this.findOne({ type: 'distribution' });
};

statisticsSchema.statics.getMissingStats = function() {
    return this.findOne({ type: 'missing' });
};

// 实例方法
statisticsSchema.methods.updateFrequency = function(numbers) {
    // 更新频率统计
    const frequency = {
        red: new Map(),
        blue: new Map()
    };
    
    numbers.forEach(draw => {
        draw.red.forEach(num => {
            frequency.red.set(num, (frequency.red.get(num) || 0) + 1);
        });
        frequency.blue.set(draw.blue, (frequency.blue.get(draw.blue) || 0) + 1);
    });

    this.data.frequency = frequency;
    this.lastUpdated = new Date();
    return this.save();
};

const Statistics = mongoose.model('Statistics', statisticsSchema);

module.exports = Statistics; 