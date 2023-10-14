package;

import PHPUnit.Framework.TestCase;

import com.JSXComponent

public class JsxTest extends JSXComponent{
   
    constructor(){
        super();
    }

    testStart(){
        const createNode = this.createNode.bind(this);
        const result = this.render( createNode );
        this.assertEquals('<div class="sss" style="width:200px"><div>Hello,worlds</div></div>', this.renderToString(result) );

        const result2 = this.createForDirective( createNode );
        const temp = `<div>
            <p>1</p>
            <div>
                <span>1-3</span>
                <div>one,0</div>
                <div>two,1</div>
                <span>1-4</span>
                <div>one,0</div>
                <div>two,1</div>
            </div>
            <p>2</p>
            <div>
                <span>2-3</span>
                <div>one,0</div>
                <div>two,1</div>
                <span>2-4</span>
                <div>one,0</div>
                <div>two,1</div>
            </div>
        </div>`

        this.assertEquals(temp.replace(/[\r\n\s]+/g, ''), this.renderToString(result2))


        const result3 = this.createIfDirective( createNode );
        const temp1 = `<div>if</div>`
        this.assertEquals(temp1.replace(/[\r\n\s]+/g, ''), this.renderToString(result3).replace(/[\r\n\s]+/g, '') )

    }

    get children(){
        return ['one','two']
    }

    createRoot( c:Function ){
        return <div>
            <li>sss</li>
        </div>
    }

    createForDirective( c:Function ){
        return <div>
            <direct:for name={[1,2]} item="value">
                    <p>{value}</p>
                    <div>
                        <direct:each name={[3,4]} item="item">
                            <span>{value}-{item}</span>
                            <div direct:for="(val,key) in children">
                                {val},{key}
                            </div>
                        </direct:each>
                    </div>
            </direct:for>
        </div>
    }

    private condition = true;

    createIfDirective( c:Function ){
        return <div>
            <direct:if condition={condition}>
                if
            </direct:if>
            <direct:else>
                else
            </direct:else>
        </div>
    }


    @Override;
    render( c:Function ){
        return <div class="sss" style={{width:"200px"}}>
            <div>Hello,worlds</div>
        </div>
    }

}

    

