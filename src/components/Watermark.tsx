import { NodeProps, Txt, Node } from "@revideo/2d";
import { createRef } from "@revideo/core";
import '../global.css';

export interface WatermarkProps extends NodeProps {
}

export class Watermark extends Node{

    private text = createRef<Txt>()

    constructor(props : WatermarkProps){
        super({...props})

        this.add(
            <Txt fill={"#FFFFFF66"} fontFamily={"Inter"} fontSize={36} ref={this.text}>&#169; Arthus Bertrand / A.F.P.</Txt>
        )

        this.children()[0].position.y(-this.text().height() + 1920/2 - 36)
        this.children()[0].position.x(-this.text().width()/2 + 1080/2 - 50)
    }
}