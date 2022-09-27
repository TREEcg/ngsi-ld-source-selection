import { Artist } from "./Artist";
import { fetch3namesWithComunica } from "./util";

class ArtistList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            matchingNames: ["", "", ""]
        };

        this.updateStateWithName(props.name);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    async updateStateWithName(name) {
        const names = await this.getNames(name);
        this.setState({name: name, matchingNames: names});
    }

    async handleChange(event) {
        this.updateStateWithName(event.target.value);
    }

    async getNames(name) {
        const bindings = await fetch3namesWithComunica(name);
        const names = [];
        for (const binding of bindings) {
            names.push(binding.get('name').value);
        }
        return names;
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.name);
        event.preventDefault();
    }

    renderArtist(i) {
        return (
            <Artist
                name={this.state.matchingNames[i]}
            />
        );
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name:
                        <input type="text" value={this.state.name} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>

                <h1>List of three artists containing name:
                    {this.props.name}
                </h1>
                    {this.renderArtist(0)}
                    {this.renderArtist(1)}
                    {this.renderArtist(2)}
            </div>
        );
    }
}

export default ArtistList;
