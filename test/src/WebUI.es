
import web.components.Component;
import web.From;
class WebUI extends Component{

    constructor(props?){
        super(props);
    }

    private name = '123';
    private show = false;

    @Override
    public onInitialized():void{
        
    }

    public onMounted(){
       this.getRef("from")
    }

    @Override
    render():VNode|Component{
        return <From ref="from">
            <div ref="div">the is from slot</div>
            <d:if condition={this.show}>
                <div>the is if condition</div>
            </d:if>
            <d:else>
                <div>the is else condition</div>
            </d:else>
            <d:for name={[1,2]} item="val" key="index">
                <div><span>the is for val:</span>{val}</div>
            </d:for>
        </From>
    }

}