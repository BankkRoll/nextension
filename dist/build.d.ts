interface BuildOptions {
    verbose?: boolean;
    generateManifest?: boolean;
    generateBackground?: boolean;
    generateContent?: boolean;
    generatePopup?: boolean;
    generateOptions?: boolean;
    generateAction?: boolean;
}
export declare function build(options: BuildOptions): Promise<void>;
export {};
