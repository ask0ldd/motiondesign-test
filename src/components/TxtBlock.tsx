import { NodeProps, Rect, Txt, Node, initial, colorSignal, signal } from "@revideo/2d";
import { all, chain, ColorSignal, createRef, easeInOutCubic, easeInSine, range, Reference, Signal, SignalValue, SimpleSignal, Vector2 } from "@revideo/core";
import '../global.css';

export interface TxtBlockProps extends NodeProps {
    textLines : string[]
}
  
export class TxtBlock extends Node {
    @initial('#00000088')
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
    private lineContainersHeight : number
    private mainContainersHeight : number
    private mainContainersWidth : number
  
    public constructor(props?: TxtBlockProps) {
        super({ ...props, });
    
        this.add(
            <Rect opacity={0} fill={this.backgroundColor} padding={this.padding} ref={this.mainContainer} direction={'column'} rowGap={10} layout>
                {props.textLines.map((textLine, index) => 
                    <Rect ref={this.lineContainers[index]} layout>
                        <Txt ref={this.textLinesRefs[index]} fill={this.textColor}>{textLine}</Txt>
                    </Rect>)}
            </Rect>
        );
    }

    public *init(open : boolean = true){
        this.mainContainer().save()
        this.lineContainers.map(lc => lc().clip(true))
        this.lineContainers.forEach(lc => lc().save())
        this.lineContainers.forEach(lc => lc().layout(false))
        this.mainContainer().restore()
        this.lineContainers.forEach(lc => lc().restore())
        this.mainContainer().layout(false)
        this.lineContainersHeight = this.lineContainers[0]().height()
        this.mainContainersHeight = this.mainContainer().height()
        this.mainContainersWidth = this.mainContainer().width()
        if(!open) {
            this.lineContainers.forEach(container => container().height(0))
            this.mainContainer().height(0)
            this.mainContainer().width(0)
            this.mainContainer().padding(0)
        }
    }

    public *lineContainersClose(){
        yield* chain(...this.lineContainers.map(lc => lc().height(0, 0.35, easeInSine)))
    }

    public *lineContainersOpen(){
        if(this.lineContainersHeight) yield* chain(...this.lineContainers.map(lc => lc().height(this.lineContainersHeight, 0.35, easeInSine)))
    }

    public *show() {
        yield* this.mainContainer().opacity(0, 0).to(1, 0.5, easeInSine);
    }
    
    public *hide() {
        yield* this.mainContainer().opacity(1, 0).to(0, 1, easeInSine);
    }

    public *snapLeftBorder(viewWidth : number){
        if(this.mainContainersWidth) this.mainContainer().position.x(- viewWidth/2 + this.mainContainersWidth/2)
    }
  
    public *closeMainContainer(){
        yield* chain(
            all(
                this.mainContainer().width(10, 1, easeInSine),
                this.mainContainer().padding(0, 1, easeInSine)
            ),
            this.mainContainer().height(0, 0.5, easeInSine),
        )
    }

    public *openMainContainer(){
        if(this.mainContainersWidth && this.mainContainersHeight)
        yield* chain(
            all(
                this.show(),
                this.mainContainer().width(this.mainContainersWidth, 0.75, easeInSine),
                this.mainContainer().padding(10, 0.75, easeInSine)
            ),
            this.mainContainer().height(this.mainContainersHeight, 0.5, easeInSine),
        )
    }
}

export default TxtBlock