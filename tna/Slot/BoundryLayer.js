//________________________________
// RotationSlot::BoundryLayer
// 2025-01-23   
//
const TypesBoundryLayerLaw = [
    { idtype: 1, name: "Закон_Степеной" }
    ,{ idtype: 2, name: "Закон_Градиентный" }
    ,{ idtype: 3, name: "Закон_Линейный" }
]

class BoundryLayer {
    static Type1 = 1; //Закон_Степеной
    static Type2 = 2; //Закон_Градиентный
    static Type3 = 3; //Закон_Линейный

    constructor(_type, m) {
        this.type = _type;
        this.m = m;
        m = this.m;

        this.kTVperTPS = 1 / (m + 1);
        this.kTPIperTPS = m / ((m + 1) * (m + 2));

        this.H = 0;
        this.M = 0;
        this.J = 0;
        this.L = 0;
        this.N = 0;

        if (this.type == BoundryLayer.Type2) {
            this.H = (2 * m + 1) / m;
            this.J = (m + 1) * (36 * m * m + 11 * m + 1) / ((3 * m + 1) * (4 * m + 1) * (5 * m + 1));
            this.M = 2 * m * (47 * m * m + 12 * m + 1) / ((3 * m + 1) * (4 * m + 1) * (5 * m + 1));
            var l1 = 2 * m * (m + 1) * (7032 * Math.pow(m, 4) + 2602 * Math.pow(m, 3) + 413 * m * m + 32 * m + 1);
            var l2 = (3 * m + 1) * (4 * m + 1) * (5 * m + 1) * (6 * m + 1) * (7 * m + 1) * (8 * m + 1);
            this.L = l1 / l2;
            this.N = (m + 1) * (2 * m + 1) / m;
        }
        else if(this.type == BoundryLayer.Type1) {
            this.H = (m + 2) / m;
            this.M = 3 * (m + 1) / (m + 5);
            this.J = 6 * (m + 3) / ((m + 4) * (m + 5));
            this.L = 18 * (m + 1) / ((m + 5) * (m + 8));
            this.N = (m + 1) * (m + 2) / m;
        }
        else if (this.type == BoundryLayer.Type3) {

            this.H = 3 * (m - 2) / (m * (2*m - 3));
            this.M = m * (Math.pow(m, 3) - 2) / (2 * m - 3);
            this.J = (6 * Math.pow(m, 3) - 5 * Math.pow(m, 4) + 10*m - 15) / (5 * (2 * m - 3));
            this.L = 2 * m * (Math.pow(m, 6) - 3 * Math.pow(m, 3) + 3) / (3 * (2 * m - 3));
            this.N = - 6 / (m * (2 * m - 3));
        }
        this.K = this.M + this.J;
        this.F = this.L / (this.M * this.J);

        let p1 = (4 * this.M * this.M - 7 * this.L) / (1 + this.H);

        if (p1 < 0)
            p1 = p1 * (-1);

        const p2 = 2.0 / this.J + 1.0 / this.L;
        // константа ТПИ на стенке по закону твердого тела solid body on wall
        this.OMEGA = 0.04535 * Math.pow(p1, 0.4) * Math.pow(p2, 0.8);

        const p3 = 4 * this.K - 11 * this.J;

        if (p3 < 0)
            p3 = p3 * (-1);

        // ТУДЛТ на стенке по закону твердого тела solid body on wall
        this.Eomega = Math.sqrt((1 + this.H) / (p3 * this.M));
        // ТУДЛТ на стенке по закону свободного вихря free trubo on wall
        this.Et = Math.sqrt((1 + this.H) / this.L);
        // ТУДЛТ на диске по закону твердого тела solid body on disk
        this.Ee = Math.sqrt((1 + this.H) * this.J / (3 * this.L * this.J + 4 * this.L * (this.K - 2 * this.J)));
       
        this.D = 0.01256 * p2 / this.Ee;
        // константа ТПИ на диске по закону твердого тела solid body on disk
        this.E = Math.pow(5 / 3 * this.D, 0.8);/**/

        const p4 = (this.J + 2 * this.L);
        const p5 = (1 + this.H) * this.L * this.J * this.J;
        // константа ТПИ на стенке по закону свободного вихря free trubo on wall
        this.Gg = 0.03014 * Math.pow(p4, 0.8) / Math.pow(p5, 0.4);

    }
}