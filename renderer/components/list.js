// @flow
import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import cssModules from 'react-css-modules';
import type {WorkType, UserType} from '../actions/type';
import Infinite from './infinite';
import ImageBox from './image-box';
import CloseButton from './close-button';
import styles from './list.css';

type Props = {
	works: Array<WorkType>,
	users: Array<UserType>,
	title: string,
	onClick: (id: string) => void,
	onNextPage: () => void
};

class List extends Component {
	props: Props;
	target: Component<*, *, *>

	handleScrollTop = (e: Event) => {
		e.preventDefault();
		const node = findDOMNode(this.target);
		node.scrollTop = 0;
	};

	handleClose = () => {
	}

	render() {
		const List = this.props.works.map(work => {
			const user = this.props.users[work.user];
			return (
				<ImageBox
					key={work.id}
					work={work}
					user={user}
					onClick={this.props.onClick}
					/>
			);
		});

		return (
			<section styleName="wrap">
				<header>
					<a styleName="title" onClick={this.handleScrollTop}>
						{this.props.title}
					</a>
					<CloseButton onClose={this.handleClose}/>
				</header>
				<div styleName="content">
					<Infinite
						ref={c => {
							this.target = c;
						}}
						onIntersect={() => this.props.onNextPage()}
						>
						{List}
					</Infinite>
				</div>
			</section>
		);
	}
}

export default cssModules(List, styles);
