import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./styles/egcmodal.css";

/**
 * EgcModal - Accessible, aria-compliant modal dialog
 * Usage:
 *   <EgcModal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="...">
 *      ...modal content...
 *   </EgcModal>
 */
const EgcModal = ({ isOpen, onRequestClose, contentLabel, children }) => {
	const overlayRef = useRef(null);
	const modalRef = useRef(null);

	// Trap focus inside modal when open
	useEffect(() => {
		if (!isOpen) return;
		const focusableEls = modalRef.current
			? modalRef.current.querySelectorAll(
					'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
				)
			: [];
		const firstEl = focusableEls[0];
		const lastEl = focusableEls[focusableEls.length - 1];
		function trap(e) {
			if (e.key !== "Tab") return;
			if (focusableEls.length === 0) return;
			if (e.shiftKey && document.activeElement === firstEl) {
				e.preventDefault();
				lastEl.focus();
			} else if (!e.shiftKey && document.activeElement === lastEl) {
				e.preventDefault();
				firstEl.focus();
			}
		}
		document.addEventListener("keydown", trap);
		// Focus first element
		firstEl && firstEl.focus();
		return () => document.removeEventListener("keydown", trap);
	}, [isOpen]);

	// Close on ESC
	useEffect(() => {
		if (!isOpen) return;
		function onEsc(e) {
			if (e.key === "Escape") onRequestClose();
		}
		document.addEventListener("keydown", onEsc);
		return () => document.removeEventListener("keydown", onEsc);
	}, [isOpen, onRequestClose]);

	// Prevent background scroll when modal is open
	useEffect(() => {
		if (!isOpen) return;
		const orig = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = orig;
		};
	}, [isOpen]);

	// Click outside to close
	function handleOverlayClick(e) {
		if (e.target === overlayRef.current) onRequestClose();
	}

	if (!isOpen) return null;

	return ReactDOM.createPortal(
		<div
			className="egcmodal-overlay"
			ref={overlayRef}
			onClick={handleOverlayClick}
			role="presentation"
			aria-modal="true"
			aria-label={contentLabel}
		>
			<div
				className="egcmodal-content"
				ref={modalRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="egcmodal-heading"
				aria-describedby="egcmodal-desc"
				tabIndex={-1}
			>
				<div className="modal-header">
					<h2 id="egcmodal-heading">{contentLabel}</h2>
				</div>
				<div className="modal-body">{children}</div>
			</div>
		</div>,
		document.body,
	);
};


export default EgcModal;
