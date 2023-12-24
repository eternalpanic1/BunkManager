const app = Vue.createApp({
    data() {
        return {
            attended: 0,
            skipped: 0,
            total: 0,
            current: 0,
            goal: 75,
            message: ''
        };
    },
    methods: {
        increaseSkipped() {
            this.skipped += 1;
            this.calculate();
        },

        decreaseSkipped() {
            this.skipped = Math.max(0, this.skipped - 1);
            this.calculate();
        },

        increaseAttended() {
            this.attended += 1;
            this.calculate();
        },

        decreaseAttended() {
            this.attended = Math.max(0, this.attended - 1);
            this.calculate();
        },
        
        goalChange(){
            this.goal = goal
            this.calculate()
        },

        calculate() {
            var attendedClasses = this.attended;
            var skippedClasses = this.skipped;
            const goalPercentage = this.goal;
            const totalClasses = attendedClasses + skippedClasses;

            var currentPercentage = (attendedClasses / totalClasses) * 100;

            this.skipped = skippedClasses;

            var classesNeeded = 0;
            var classesCanSkip = 0;

            if (currentPercentage < goalPercentage) {
                var remainingPercentage = goalPercentage - currentPercentage;
                classesNeeded = Math.ceil((remainingPercentage * totalClasses) / (100 - goalPercentage));
                this.message = `You need to attend ${classesNeeded} more classes to reach your goal.`;
            } 
            else {
                var excessPercentage = currentPercentage - goalPercentage;
                classesCanSkip = Math.floor((excessPercentage * totalClasses) / goalPercentage);
                this.message = `You can skip up to ${classesCanSkip} classes and still meet your goal.`;
            }

            this.total = totalClasses;
            this.current = currentPercentage.toFixed(2);
        }
    }
});

app.mount('#app');
