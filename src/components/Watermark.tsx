import { NodeProps, Rect, Txt, Node, initial, colorSignal, signal, Layout } from "@revideo/2d";
import { createRef } from "@revideo/core";
import '../global.css';

export interface WatermarkProps extends NodeProps {
}

export class Watermark extends Node{

    private text = createRef<Txt>()

    constructor(props : WatermarkProps){
        super({...props})

        this.add(
            <Txt fill={"#FFFFFF66"} fontSize={36} ref={this.text}>@ Arthus Bertrand / A.F.P.</Txt>
        )

        this.position.y(-this.text().height() + 1920/2 - 36)
        this.position.x(-this.text().width()/2 + 1080/2)
    }
}