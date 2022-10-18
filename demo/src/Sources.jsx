export function Sources({sources}) {
    const items = [];

    for (const s of sources) {
        let li = s.value;
        if (s.type) li += ' (' + s.type + ')';
        items.push(<li key={li.toString()}>{li}</li>);
    }

    return <ul>{items}</ul>;
}
