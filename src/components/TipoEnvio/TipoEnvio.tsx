import Swal from 'sweetalert2';
import ReactDOMServer from 'react-dom/server';
import {MdDeliveryDining, MdFoodBank} from 'react-icons/md';
import styles from './TipoEnvio.module.css';

export async function tipoEnvio(): Promise<'delivery' | 'takeaway' | null> {
    const htmlContent = ReactDOMServer.renderToString(
        <div className={styles.container}>
            <div id="card-delivery" className={styles.card}>
                <input type="checkbox" id="opt-delivery" className={styles.checkbox}/>
                <div className={styles.cardContent}>
                    <div className={`${styles.cardTitle} ${styles.deliveryTitle}`}>
                        <MdDeliveryDining size={24}/> Delivery
                    </div>
                    <div className={styles.cardSubtitle}>Te lo llevamos a tu dirección</div>
                </div>
            </div>

            <div id="card-takeout" className={styles.card}>
                <input type="checkbox" id="opt-takeout" className={styles.checkbox}/>
                <div className={styles.cardContent}>
                    <div className={`${styles.cardTitle} ${styles.takeoutTitle}`}>
                        <MdFoodBank size={24}/> Takeout
                    </div>
                    <div className={styles.cardSubtitle}>Retirás por el local</div>
                </div>
            </div>
        </div>
    );

    const result = await Swal.fire<string>({
        title: '¡Elegí cómo querés tu pedido!',
        html: htmlContent,
        focusConfirm: false,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: styles.popup,
            confirmButton: styles.confirmButton,
            cancelButton: styles.cancelButton
        },
        didOpen: () => {
            const delivery = document.getElementById('opt-delivery') as HTMLInputElement | null;
            const takeout = document.getElementById('opt-takeout') as HTMLInputElement | null;
            const cDelivery = document.getElementById('card-delivery') as HTMLDivElement | null;
            const cTakeout = document.getElementById('card-takeout') as HTMLDivElement | null;
            const confirmBtn = Swal.getConfirmButton();

            if (confirmBtn) {
                confirmBtn.disabled = true;
                confirmBtn.style.cursor = 'not-allowed';
            }

            const updateCardsUI = () => {
                const selectedDelivery = !!delivery?.checked;
                const selectedTakeout = !!takeout?.checked;

                if (cDelivery) {
                    cDelivery.classList.toggle(styles.cardSelected, selectedDelivery);
                    cDelivery.classList.toggle(styles.cardUnselected, !selectedDelivery);
                }

                if (cTakeout) {
                    cTakeout.classList.toggle(styles.cardSelected, selectedTakeout);
                    cTakeout.classList.toggle(styles.cardUnselected, !selectedTakeout);
                }

                if (confirmBtn) {
                    const enabled = selectedDelivery || selectedTakeout;
                    confirmBtn.disabled = !enabled;
                    confirmBtn.style.cursor = enabled ? 'pointer' : 'not-allowed';
                }
            };

            const makeExclusive = (changed: HTMLInputElement, other: HTMLInputElement) => {
                changed.addEventListener('change', () => {
                    if (changed.checked) other.checked = false;
                    updateCardsUI();
                });
            };

            if (delivery && takeout) {
                makeExclusive(delivery, takeout);
                makeExclusive(takeout, delivery);
            }

            const toggleFromCard = (card: HTMLDivElement | null, checkbox: HTMLInputElement | null, other: HTMLInputElement | null) => {
                card?.addEventListener('click', (e) => {
                    if ((e.target as HTMLElement).tagName.toLowerCase() === 'input') return;
                    if (!checkbox) return;
                    checkbox.checked = !checkbox.checked;
                    if (checkbox.checked && other) {
                        other.checked = false;
                    }
                    updateCardsUI();
                });
            };

            toggleFromCard(cDelivery, delivery, takeout);
            toggleFromCard(cTakeout, takeout, delivery);

            cDelivery?.classList.add(styles.cardUnselected);
            cTakeout?.classList.add(styles.cardUnselected);
            updateCardsUI();
        },
        preConfirm: () => {
            const delivery = document.getElementById('opt-delivery') as HTMLInputElement | null;
            const takeout = document.getElementById('opt-takeout') as HTMLInputElement | null;
            const d = !!delivery?.checked;
            const t = !!takeout?.checked;

            if (!d && !t) {
                Swal.showValidationMessage('Selecciona una opción');
                return;
            }
            return d ? 'delivery' : 'takeaway';
        }
    });

    if (!result.isConfirmed || !result.value) return null;

    return result.value as 'delivery' | 'takeaway';
}
