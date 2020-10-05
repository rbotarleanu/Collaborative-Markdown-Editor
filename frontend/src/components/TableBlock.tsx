import React from 'react';
import '../styles/TableBlock.css';

interface Props {
    text: string
};

type DataFrame = Array<any>[];

interface State {
    table: DataFrame
};



export default class TableBlock extends React.Component<Props, State> {

    private TABLE_SEP = '|';
    private LINE_SEP = '\n';

    constructor(props: Props) {
        super(props);

        this.state = {
            table: this.toDataFrame(props.text)
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.text !== this.props.text) {
            this.setState({table: this.toDataFrame(this.props.text)});
        }
    }

    toDataFrame(text: string): DataFrame {
        var df: DataFrame = [];

        let rows = text.split(this.LINE_SEP);
        
        if (rows.length < 1) {
            return df;
        }

        let header = rows[0];
        let columns = header.split(this.TABLE_SEP).filter(
            (value) => value.length !== 0);

        df.push(columns);

        for (var rowId = 1; rowId < rows.length; rowId++) {
            let row = rows[rowId];
            let values = row.split(this.TABLE_SEP).filter(
                (value) => value.length !== 0);

            if (values.length !== columns.length) {
                continue;
            }

            df.push(values);
        }

        return df;
    }

    renderHeading(table: DataFrame): JSX.Element {
        return (
            <table>
                <tbody>
                    {this.state.table.map((row, rowIdx) => {
                        if (rowIdx === 0) {
                            return (
                                <tr key={rowIdx}>
                                    {row.map((name, colIdx) => {
                                        return <th key={rowIdx + "-" + colIdx}>{name}</th>;
                                    })}
                                </tr>
                            );
                        }

                        return (
                            <tr key={rowIdx}>
                                {row.map((value, colIdx) => {
                                    return <td key={rowIdx + "-" + colIdx}>{value}</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        )
    }

    render() {
        return (
            <div className="UnorderedListBlock">
                {this.renderHeading(this.state.table)}
            </div>
        )
    }
}