const mongoose = require('mongoose');

const drawResultSchema = new mongoose.Schema({
    drawNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    drawDate: {
        type: Date,
        required: true,
        index: true
    },
    numbers: {
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
    prizePool: {
        type: Number,
        required: true,
        min: 0
    },
    prizes: {
        first: {
            count: { type: Number, default: 0 },
            amount: { type: Number, default: 0 }
        },
        second: {
            count: { type: Number, default: 0 },
            amount: { type: Number, default: 0 }
        },
        third: {
            count: { type: Number, default: 0 },
            amount: { type: Number, default: 0 }
        }
    },
    totalSales: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

// 索引
drawResultSchema.index({ drawDate: -1 });
drawResultSchema.index({ 'numbers.red': 1 });
drawResultSchema.index({ 'numbers.blue': 1 });

// 静态方法
drawResultSchema.statics.getLatest = function() {
    return this.findOne().sort({ drawDate: -1 });
};

drawResultSchema.statics.getHistory = function(limit = 50) {
    return this.find()
        .sort({ drawDate: -1 })
        .limit(limit);
};

// 实例方法
drawResultSchema.methods.getNumberFrequency = function() {
    return this.numbers.red.reduce((acc, num) => {
        acc[num] = (acc[num] || 0) + 1;
        return acc;
    }, {});
};

const DrawResult = mongoose.model('DrawResult', drawResultSchema);

module.exports = DrawResult; 