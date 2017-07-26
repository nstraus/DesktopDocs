import React from 'react';
import { Link } from 'react-router-dom';
import { Editor, EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import customStyleMap from '../customMaps/customStyleMap';
import Toolbar from './Toolbar';
import extendedBlockRenderMap from '../customMaps/customBlockMap';
import axios from 'axios';

class DocEdit extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            editorState: EditorState.createEmpty(),
            socket: this.props.socket,
            docId: this.props.match.params.docid,
            documentTitle: ''
        };
        this.onChange = ( editorState ) => {
            this.setState( { editorState } );
            const rawDraftContentState = JSON.stringify( convertToRaw(this.state.editorState.getCurrentContent()) );
            this.state.socket.emit('madeChange', {rawDraftContentState});
        };
        this.focus = () => this.refs.editor.focus();
    }

    _saveDocument() {
        const rawDraftContentState = JSON.stringify( convertToRaw(this.props.docEdit.state.editorState.getCurrentContent()) );
        axios.post('http://localhost:3000/save', {
            contentState: rawDraftContentState,
            docId: this.props.docEdit.props.match.params.docid
        })
        .then(response => {
            console.log('Document successfully saved');
            //TODO implement a popup window alerting the user that doc has been saved
        })
        .catch(err => {
            console.log('error saving document', err);
        });
    }

    componentWillMount() {
        axios.post("http://localhost:3000/loadDocument", {
            docId: this.state.docId
        })
        .then(response => {
            const loadedContentState = convertFromRaw( JSON.parse(response.data.doc.contentState[response.data.doc.contentState.length - 1]) );
            this.setState({
                editorState: EditorState.createWithContent(loadedContentState),
                documentTitle: response.data.doc.title
            });
            //console.log('poopy')
            //console.log('titleState', this.state.documentTitle)
            this.state.socket.emit('joinedDocument', this.state.docId);
        })
        .catch(err => {
            console.log('error loading document', err);
        });
    }

    componentWillUnmount() {
        this.state.socket.emit('leftDocument', this.state.docId);
        //this._saveDocument();
        //clearInterval
    }

    render() {
        return (
            <div>
                <div>
                    <Link to="/home">Docs Home</Link>
                </div>
                <div className="editorTitle">
                    <h1>{ this.state.documentTitle }</h1>
                    <p>ID: { this.state.docId }</p>
                </div>
                <Toolbar onSaveDocument={ this._saveDocument } docEdit={ this } />
                <div className='editor' onClick={ this.focus }>
                  <Editor customStyleMap={ customStyleMap } editorState={ this.state.editorState } onChange={ this.onChange }
                      placeholder="Write something colorful..."
                      ref="editor" blockRenderMap={ extendedBlockRenderMap }
                  />
                </div>
            </div>
        );
    }
}

export default DocEdit;
