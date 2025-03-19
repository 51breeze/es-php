package web;
import web.components.Component;
class Input extends Component{

    constructor(props){
        super(props);
    }

    @Override
    render():VNode|Component{
        return <div class="input">
            <input></input>
            <span>icon</span>
        </div>
    }

}