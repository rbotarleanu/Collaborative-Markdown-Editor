
export default class Color {
    public red: number;
    public green: number;
    public blue: number;

    constructor(red: number, green: number, blue: number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    getRGB() {
        return "rgb(" + [this.red, this.green, this.blue].join(',') + ")";
    }

    combine(other: Color) {
        return new Color(
            Math.round(.5 * (this.red + other.red)),
            Math.round(.5 * (this.green + other.green)),
            Math.round(.5 * (this.blue + other.blue))
        );
    }
};

export const ColorPresets = [
    new Color(200, 0, 0),
    new Color(0, 200, 0),
    new Color(0, 0, 200),
    new Color(128, 0, 128),
    new Color(0, 128, 128),
    new Color(128, 128, 0),
    new Color(255, 0, 255),
    new Color(0, 255, 255),
    new Color(255, 255, 0)
];