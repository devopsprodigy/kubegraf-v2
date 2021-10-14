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


    return {
        overviewPanel: overviewPanel,
        chevron: chevron,

        header: header,
        title: title,

        overviewPanelBtn: overviewPanelBtn,

        namespaceCounter: namespaceCounter,
        verticalLine: verticalLine,

        overviewSpan: overviewSpan,
        overviewSpanLast: overviewSpanLast
    }
}
