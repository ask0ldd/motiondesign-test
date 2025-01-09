import { NodeProps, Rect, Txt, Node, Layout, View2D } from "@revideo/2d";
import { loop } from "@revideo/core";

export interface LogoProps extends NodeProps {
    size : number
}

export class Star extends Node {

    public constructor(props: LogoProps) {
        super({ ...props });

        this.add(
            <Rect width={props.size} height={props.size}>
                <Rect height={props.size} width={props.size * 0.1} fill={"#FFFFFF"}/>
                <Rect width={props.size} height={props.size * 0.1} fill={"#FFFFFF"}/>
            </Rect>
        )
    }

    *randomMove(view : View2D){
        yield* loop(() => {
            if(view.width() && view.height()) {
                const newX = this.getRandomInt(-view.width()/2, view.width()/2);
                const newY = this.getRandomInt(-view.height()/2, view.height()/2);
                return this.position([newX, newY], 3);
            }
        })
    }

    getRandomInt(min : number, max : number){
        return Math.floor(Math.random() * ((max-min)+1) + min)
    }
}