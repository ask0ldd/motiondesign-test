import { NodeProps, Rect, Txt, Node, initial, colorSignal, signal } from "@revideo/2d";
import { all, chain, ColorSignal, createRef, easeInOutCubic, range, Reference, Signal, SignalValue, SimpleSignal, Vector2 } from "@revideo/core";
import '../global.css';

export interface TxtBlockProps extends NodeProps {
    textLines : string[]
}
  
export class TxtBlock extends Node {
    @initial('#00000099')
    @colorSignal()
    public declare readonly backgroundColor: ColorSignal<this>;
  
    @initial('#ffffff')
    @colorSignal()
    public declare readonly textColor: ColorSignal<this>;
  
    @initial(20)
    @signal()
    public declare readonly padding: SimpleSignal<number>;
  
    private mainContainer = createRef<Rect>();
    private lineContainers = range(5).map(rec => createRef<Rect>())
    private textLinesRefs = range(5).map(line => createRef<Txt>())
  
    public constructor(props?: TxtBlockProps) {
        super({ ...props, });
    
        this.add(
            <Rect opacity={0} fill={this.backgroundColor} padding={this.padding} ref={this.mainContainer} direction={'column'} rowGap={10} layout>
                {props.textLines.map((textLine, index) => 
                    <Rect fill={"#0000ff"} ref={this.lineContainers[index]} layout>
                        <Txt ref={this.textLinesRefs[index]} fill={this.textColor}>{textLine}</Txt>
                    </Rect>)}
            </Rect>
        );
    }

    public *init(){
        this.mainContainer().save()
        this.lineContainers.forEach(lc => lc().save())
        this.mainContainer().layout(false)
        this.mainContainer().restore()
        /*this.lineContainers.forEach(lc => lc().layout(false))
        this.lineContainers.forEach(lc => lc().restore())
        this.lineContainers.forEach(lc => lc().clip(true))*/
        yield* this.lineContainers.map(lc => lc().layout(false))
        yield* this.lineContainers.map(lc => lc().restore())
        yield* this.lineContainers.map(lc => lc().clip(true))
    }

    public *lineContainersClose(){
        yield* chain(...this.lineContainers.map(lc => lc().height(0, 1)))
    }

    public *show() {
        yield* this.mainContainer().opacity(0, 0).to(1, 1);
    }
    
    public *hide() {
        yield* this.mainContainer().opacity(1, 0).to(0, 1);
    }
  
}

export default TxtBlock