import {css} from "@emotion/css"



export const Styles = (isLight: boolean) => {

    const overviewPanel = css`
            border-radius: 3px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;
            background-color: ${isLight ? "#e4e8ec" : "#2d2d30"};
        `;

    const overviewPanelBody = css `
        display: flex;
        justify-content: space-between;
        margin-top: 24px;
        
        h2 {
            font-size: 18px;
            font-weight: normal;
            margin-bottom: 20px;
            line-height: 18px;
        }
    `;

    const chevron = css `
            display: block;
            width: 14px;
            min-width: 14px;
            height: 24px;
            margin-right: 6px;
            background: url('/public/plugins/devopsprodigy-kubegraf-app/img/chevron.svg') center no-repeat;
            
            &.active{
                transform: rotate(180deg);
            }
        `;

    const header = css `
            display: flex;
            justify-content: space-between;
        `;

    const title = css `
        cursor: pointer;
        display: flex;
        margin-top: 2px;
        
        h1 {
            font-size: 24px;
            color: #eaeaea;
            line-height: 24px;
            font-weight: normal;
            margin-bottom: initial;
        }
    `;

    const status = css `
        font-size: 14px;
        color: #8e8e8e;
        margin: 4px 0 0 20px;
        min-width: 90px;
        text-align: end;
        
        span {
          color: #c04c21;
        }    
    `;

    const overviewPanelBtn = css `
        display: flex;
        min-width: 325px;
        justify-content: flex-end;
    `;

    const overviewSpan = css `
        margin: 0 10px;
    `;

    const overviewSpanLast = css `
        margin-left: 10px;
    `;


    const namespaceCounter = css `
        font-size: 14px;
        line-height: 33px;
        height: 33px;
        color: #8e8e8e;
        
        .active{
            color: #c74c2a
        }    
    `;

    const verticalLine = css`
        display: inline-block;
        width: 1px;
        height: 33px;
        background-color: #161719;
        margin-right: 20px!important;    
    `;

    const gfInline = css `
        display: inline-block;
        margin-bottom: 0;
    `;

    const clusterComponents = css `
        display: flex;
        flex-direction: column;
        font-size: 14px;
        margin-right: 20px;
        
        .component{
            margin-bottom: 8px;
            display: flex; 
        }    
    `;

    const clusterNamespaces = css `
        display: flex;
        align-content: flex-start;
        flex-flow: wrap;
        max-width: 700px;
    `;

    const statusIndicator = css `
        display: block;
        min-width: 6px;
        width: 6px;
        height: 6px;
        border-radius: 100%;
        margin-top: 8px;
        margin-right: 8px;   
        
        &.red, &.error {
            background-color: #d34d36;
        }
        &.green, &.success {
            background-color: #83df57;
        }
        &.yellow, &.warning {
            background-color: #fcff00;
        }
        &.terminating, &.succeeded {
            background-color: #555555;
        } 
    `;

    const checkboxContainer = css `
        width: 165px;
        display: flex;
        margin-bottom: 6px;
        margin-left: 10px;   
        
        input {
            display: none;
        }
        
        span {
            position: absolute;
            height: 16px;    
            width: 16px;
            border-radius: 3px;
            border: 1px solid #555;
            background: #141414;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        input:checked+span{
            background: linear-gradient(0deg,#eb7b18,#d44a3a);
            border: none;
        }
        
        input:checked+span:before{
            font-family: FontAwesome;
            content: "\\f00c";
            color: #141414;    
        }

        label {
            font-size: 14px;
            line-height: 16px;
            min-height: 18px;
            padding-left: 24px;
            position: relative;
            cursor: pointer;
            color: #b8b8b8;    
        }
        
    `;

    const namespacePanel = css `
        background-color: #212124;
        margin-bottom: 10px;
        padding: 16px;
        border-radius: 3px;
        
        .header {
            padding: 16px 0;
            display: flex;
            justify-content: space-between;
        }
    `;

    const namespacePanelBtn = css `
        display: flex;
        flex-wrap: wrap;
    `;

    const namespacePanelBody = css `
        display: flex;
        margin-top: 24px;
        
        .column {
            width: 100%;
            display: flex;
            flex-direction: column;
            border-right: 1px solid #161719;
            
            &:last-child {
                border: none;
            }    
        }
        
        .column_header {
            display: flex;
            justify-content: space-between;
            
            h3 {
                font-size: 18px;
                margin: 0 0 24px 10px;    
            }    
        }
    `;

    const btn = css `
        font-size: 12px;
        padding: 0 20px;
        line-height: 33px;
        height: 33px;
        cursor: pointer;
        
        &.btn-grey{
            font-size: 12px;
            padding: 8px 10px;
            height: 30px;
            line-height: 15px;
            white-space: nowrap;
            margin: 0 10px;
            width: fit-content;
            
            color: ${isLight ? "initial" : "#b8b8b8" };
            background-color: ${isLight ? "#dce1e6" : "#272729"};
            box-shadow: ${isLight ? "1px 1px 1px 0 #b8b8b8" : "1px 1px 1px 0 black"};
        }     
    `;


    return {

        btn: btn,

        overviewPanel: overviewPanel,
        overviewPanelBody: overviewPanelBody,
        chevron: chevron,

        header: header,
        title: title,
        status: status,

        overviewPanelBtn: overviewPanelBtn,

        namespaceCounter: namespaceCounter,
        verticalLine: verticalLine,

        overviewSpan: overviewSpan,
        overviewSpanLast: overviewSpanLast,
        gfInline: gfInline,

        clusterComponents: clusterComponents,
        clusterNamespaces: clusterNamespaces,
        statusIndicator: statusIndicator,

        checkboxContainer: checkboxContainer,

        namespacePanel: namespacePanel,
        namespacePanelBtn: namespacePanelBtn,
        namespacePanelBody: namespacePanelBody
    }
}
